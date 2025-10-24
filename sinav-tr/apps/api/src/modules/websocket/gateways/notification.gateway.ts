import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../../../prisma/prisma.service';

interface NotificationPayload {
  id: string;
  type: 'EXAM_START' | 'EXAM_END' | 'ACHIEVEMENT' | 'MESSAGE' | 'SYSTEM' | 'PAYMENT' | 'REMINDER';
  title: string;
  message: string;
  data?: any;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  timestamp: Date;
  read: boolean;
}

interface OnlineUser {
  userId: string;
  socketId: string;
  connectedAt: Date;
  status: 'ONLINE' | 'AWAY' | 'BUSY' | 'OFFLINE';
  currentPage?: string;
  examSessionId?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_URL
      : ['http://localhost:3000', 'http://localhost:3002'],
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private onlineUsers: Map<string, OnlineUser> = new Map();
  private userSockets: Map<string, Set<string>> = new Map(); // userId -> socketIds

  constructor(
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
    private prisma: PrismaService,
  ) {}

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      // Extract token from query or auth header
      const token = client.handshake.query.token as string || 
                   client.handshake.auth.token;

      if (!token) {
        client.disconnect();
        return;
      }

      // Verify JWT token
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      // Create online user record
      const onlineUser: OnlineUser = {
        userId,
        socketId: client.id,
        connectedAt: new Date(),
        status: 'ONLINE',
      };

      // Store connection
      this.onlineUsers.set(client.id, onlineUser);
      
      // Track multiple connections per user
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(client.id);

      // Join user-specific room
      client.join(`user:${userId}`);

      // Send pending notifications
      await this.sendPendingNotifications(userId, client);

      // Broadcast user online status
      this.broadcastUserStatus(userId, 'ONLINE');

      // Emit connection success
      client.emit('connected', {
        userId,
        socketId: client.id,
        timestamp: new Date(),
      });

      console.log(`User ${userId} connected with socket ${client.id}`);
    } catch (error) {
      console.error('Connection error:', error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const onlineUser = this.onlineUsers.get(client.id);
    
    if (onlineUser) {
      const { userId } = onlineUser;
      
      // Remove from online users
      this.onlineUsers.delete(client.id);
      
      // Remove from user sockets
      const userSocketSet = this.userSockets.get(userId);
      if (userSocketSet) {
        userSocketSet.delete(client.id);
        
        // If user has no more connections, mark as offline
        if (userSocketSet.size === 0) {
          this.userSockets.delete(userId);
          this.broadcastUserStatus(userId, 'OFFLINE');
          
          // Update last seen
          await this.prisma.user.update({
            where: { id: userId },
            data: { lastSeen: new Date() },
          });
        }
      }

      console.log(`User ${userId} disconnected from socket ${client.id}`);
    }
  }

  @SubscribeMessage('mark-notification-read')
  async handleMarkAsRead(
    @MessageBody() data: { notificationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const onlineUser = this.onlineUsers.get(client.id);
    if (!onlineUser) return;

    await this.prisma.notification.update({
      where: { id: data.notificationId },
      data: { read: true, readAt: new Date() },
    });

    client.emit('notification-marked-read', {
      notificationId: data.notificationId,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('mark-all-read')
  async handleMarkAllAsRead(@ConnectedSocket() client: Socket) {
    const onlineUser = this.onlineUsers.get(client.id);
    if (!onlineUser) return;

    await this.prisma.notification.updateMany({
      where: {
        userId: onlineUser.userId,
        read: false,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

    client.emit('all-notifications-marked-read', {
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('update-status')
  async handleUpdateStatus(
    @MessageBody() data: { status: 'ONLINE' | 'AWAY' | 'BUSY' },
    @ConnectedSocket() client: Socket,
  ) {
    const onlineUser = this.onlineUsers.get(client.id);
    if (!onlineUser) return;

    onlineUser.status = data.status;
    this.broadcastUserStatus(onlineUser.userId, data.status);
  }

  @SubscribeMessage('update-page')
  async handleUpdatePage(
    @MessageBody() data: { page: string },
    @ConnectedSocket() client: Socket,
  ) {
    const onlineUser = this.onlineUsers.get(client.id);
    if (!onlineUser) return;

    onlineUser.currentPage = data.page;
    
    // Track page analytics
    await this.prisma.pageView.create({
      data: {
        userId: onlineUser.userId,
        page: data.page,
        timestamp: new Date(),
      },
    });
  }

  // Event listeners for system events
  @OnEvent('exam.started')
  async handleExamStarted(payload: any) {
    const notification: NotificationPayload = {
      id: `notif_${Date.now()}`,
      type: 'EXAM_START',
      title: 'Sınav Başladı',
      message: 'Sınavınız başladı. Başarılar!',
      data: payload,
      priority: 'HIGH',
      timestamp: new Date(),
      read: false,
    };

    await this.sendNotificationToUser(payload.userId, notification);
  }

  @OnEvent('exam.auto-submitted')
  async handleExamAutoSubmitted(payload: any) {
    const notification: NotificationPayload = {
      id: `notif_${Date.now()}`,
      type: 'EXAM_END',
      title: 'Sınav Süresi Doldu',
      message: 'Sınav süreniz doldu ve cevaplarınız otomatik olarak kaydedildi.',
      data: payload,
      priority: 'HIGH',
      timestamp: new Date(),
      read: false,
    };

    await this.sendNotificationToUser(payload.userId, notification);
  }

  @OnEvent('exam.result-calculated')
  async handleExamResultCalculated(payload: any) {
    const notification: NotificationPayload = {
      id: `notif_${Date.now()}`,
      type: 'EXAM_END',
      title: 'Sınav Sonucunuz Hazır',
      message: `Sınavınızdan ${payload.score.toFixed(1)} puan aldınız!`,
      data: payload,
      priority: 'MEDIUM',
      timestamp: new Date(),
      read: false,
    };

    // Get userId from session
    const session = await this.prisma.examSession.findUnique({
      where: { id: payload.sessionId },
      select: { userId: true },
    });

    if (session) {
      await this.sendNotificationToUser(session.userId, notification);
    }
  }

  @OnEvent('achievements.unlocked')
  async handleAchievementUnlocked(payload: any) {
    for (const achievement of payload.achievements) {
      const notification: NotificationPayload = {
        id: `notif_${Date.now()}_${achievement}`,
        type: 'ACHIEVEMENT',
        title: '🏆 Yeni Başarı!',
        message: `Tebrikler! "${achievement}" başarısını kazandınız!`,
        data: { achievement },
        priority: 'MEDIUM',
        timestamp: new Date(),
        read: false,
      };

      await this.sendNotificationToUser(payload.userId, notification);
    }
  }

  @OnEvent('payment.success')
  async handlePaymentSuccess(payload: any) {
    const notification: NotificationPayload = {
      id: `notif_${Date.now()}`,
      type: 'PAYMENT',
      title: 'Ödeme Başarılı',
      message: 'Ödemeniz başarıyla alındı. Premium özellikler aktif edildi!',
      data: payload,
      priority: 'HIGH',
      timestamp: new Date(),
      read: false,
    };

    await this.sendNotificationToUser(payload.userId, notification);
  }

  @OnEvent('learning-path.generated')
  async handleLearningPathGenerated(payload: any) {
    const notification: NotificationPayload = {
      id: `notif_${Date.now()}`,
      type: 'SYSTEM',
      title: 'Öğrenme Planınız Hazır',
      message: 'Kişiselleştirilmiş öğrenme planınız oluşturuldu. Hemen başlayın!',
      data: payload,
      priority: 'MEDIUM',
      timestamp: new Date(),
      read: false,
    };

    await this.sendNotificationToUser(payload.userId, notification);
  }

  // Helper methods
  private async sendNotificationToUser(
    userId: string,
    notification: NotificationPayload,
  ) {
    // Save to database
    await this.prisma.notification.create({
      data: {
        userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        priority: notification.priority,
        read: false,
      },
    });

    // Send to all user's connected sockets
    const socketIds = this.userSockets.get(userId);
    if (socketIds && socketIds.size > 0) {
      this.server.to(`user:${userId}`).emit('notification', notification);
    } else {
      // User is offline, notification saved to database for later
      console.log(`User ${userId} is offline, notification saved`);
    }
  }

  private async sendPendingNotifications(userId: string, client: Socket) {
    const pendingNotifications = await this.prisma.notification.findMany({
      where: {
        userId,
        read: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    });

    if (pendingNotifications.length > 0) {
      client.emit('pending-notifications', pendingNotifications);
    }
  }

  private broadcastUserStatus(userId: string, status: string) {
    this.server.emit('user-status-changed', {
      userId,
      status,
      timestamp: new Date(),
    });
  }

  // Broadcast to exam room
  async broadcastToExamRoom(examId: string, event: string, data: any) {
    this.server.to(`exam:${examId}`).emit(event, data);
  }

  // Join exam room
  @SubscribeMessage('join-exam')
  async handleJoinExam(
    @MessageBody() data: { examId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const onlineUser = this.onlineUsers.get(client.id);
    if (!onlineUser) return;

    client.join(`exam:${data.examId}`);
    onlineUser.examSessionId = data.examId;

    // Notify others in exam
    client.to(`exam:${data.examId}`).emit('user-joined-exam', {
      userId: onlineUser.userId,
      timestamp: new Date(),
    });
  }

  // Leave exam room
  @SubscribeMessage('leave-exam')
  async handleLeaveExam(
    @MessageBody() data: { examId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const onlineUser = this.onlineUsers.get(client.id);
    if (!onlineUser) return;

    client.leave(`exam:${data.examId}`);
    delete onlineUser.examSessionId;

    // Notify others in exam
    client.to(`exam:${data.examId}`).emit('user-left-exam', {
      userId: onlineUser.userId,
      timestamp: new Date(),
    });
  }

  // Get online users count
  getOnlineUsersCount(): number {
    return this.userSockets.size;
  }

  // Get online users list
  getOnlineUsers(): string[] {
    return Array.from(this.userSockets.keys());
  }

  // Check if user is online
  isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId);
  }

  // Send direct message to user
  async sendDirectMessage(fromUserId: string, toUserId: string, message: string) {
    const notification: NotificationPayload = {
      id: `msg_${Date.now()}`,
      type: 'MESSAGE',
      title: 'Yeni Mesaj',
      message: message,
      data: { fromUserId },
      priority: 'MEDIUM',
      timestamp: new Date(),
      read: false,
    };

    await this.sendNotificationToUser(toUserId, notification);
  }
}
