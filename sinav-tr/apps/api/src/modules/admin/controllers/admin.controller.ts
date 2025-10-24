import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RateLimit } from '../../../guards/rate-limit.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Dashboard Statistics
  @Get('dashboard/stats')
  @RateLimit({ points: 100, duration: 60 })
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('dashboard/real-time')
  async getRealTimeStats() {
    return this.adminService.getRealTimeStats();
  }

  // User Management
  @Get('users')
  async getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getUsers({
      page: Number(page),
      limit: Number(limit),
      search,
      role,
      status,
    });
  }

  @Get('users/:id')
  async getUserDetails(@Param('id') id: string) {
    return this.adminService.getUserDetails(id);
  }

  @Put('users/:id')
  async updateUser(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateUser(id, data);
  }

  @Post('users/:id/ban')
  async banUser(
    @Param('id') id: string,
    @Body() data: { reason: string; duration?: number },
  ) {
    return this.adminService.banUser(id, data.reason, data.duration);
  }

  @Post('users/:id/unban')
  async unbanUser(@Param('id') id: string) {
    return this.adminService.unbanUser(id);
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // Question Management
  @Get('questions')
  async getQuestions(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('subject') subject?: string,
    @Query('topic') topic?: string,
    @Query('difficulty') difficulty?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getQuestions({
      page: Number(page),
      limit: Number(limit),
      subject,
      topic,
      difficulty,
      status,
    });
  }

  @Post('questions')
  async createQuestion(@Body() data: any) {
    return this.adminService.createQuestion(data);
  }

  @Put('questions/:id')
  async updateQuestion(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateQuestion(id, data);
  }

  @Delete('questions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteQuestion(@Param('id') id: string) {
    return this.adminService.deleteQuestion(id);
  }

  @Post('questions/bulk-import')
  async bulkImportQuestions(@Body() data: any) {
    return this.adminService.bulkImportQuestions(data);
  }

  @Post('questions/:id/approve')
  async approveQuestion(@Param('id') id: string) {
    return this.adminService.approveQuestion(id);
  }

  @Post('questions/:id/reject')
  async rejectQuestion(
    @Param('id') id: string,
    @Body() data: { reason: string },
  ) {
    return this.adminService.rejectQuestion(id, data.reason);
  }

  // Exam Management
  @Get('exams')
  async getExams(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('type') type?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getExams({
      page: Number(page),
      limit: Number(limit),
      type,
      status,
    });
  }

  @Post('exams')
  async createExam(@Body() data: any) {
    return this.adminService.createExam(data);
  }

  @Put('exams/:id')
  async updateExam(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateExam(id, data);
  }

  @Delete('exams/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteExam(@Param('id') id: string) {
    return this.adminService.deleteExam(id);
  }

  @Post('exams/:id/publish')
  async publishExam(@Param('id') id: string) {
    return this.adminService.publishExam(id);
  }

  @Post('exams/:id/unpublish')
  async unpublishExam(@Param('id') id: string) {
    return this.adminService.unpublishExam(id);
  }

  // Payment Management
  @Get('payments')
  async getPayments(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.adminService.getPayments({
      page: Number(page),
      limit: Number(limit),
      status,
      startDate,
      endDate,
    });
  }

  @Get('payments/:id')
  async getPaymentDetails(@Param('id') id: string) {
    return this.adminService.getPaymentDetails(id);
  }

  @Post('payments/:id/refund')
  async refundPayment(
    @Param('id') id: string,
    @Body() data: { reason: string },
  ) {
    return this.adminService.refundPayment(id, data.reason);
  }

  // Subscription Management
  @Get('subscriptions')
  async getSubscriptions(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('status') status?: string,
    @Query('planId') planId?: string,
  ) {
    return this.adminService.getSubscriptions({
      page: Number(page),
      limit: Number(limit),
      status,
      planId,
    });
  }

  @Put('subscriptions/:id')
  async updateSubscription(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateSubscription(id, data);
  }

  @Post('subscriptions/:id/cancel')
  async cancelSubscription(@Param('id') id: string) {
    return this.adminService.cancelSubscription(id);
  }

  // Content Management
  @Get('content/subjects')
  async getSubjects() {
    return this.adminService.getSubjects();
  }

  @Post('content/subjects')
  async createSubject(@Body() data: any) {
    return this.adminService.createSubject(data);
  }

  @Put('content/subjects/:id')
  async updateSubject(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateSubject(id, data);
  }

  @Delete('content/subjects/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSubject(@Param('id') id: string) {
    return this.adminService.deleteSubject(id);
  }

  @Get('content/topics')
  async getTopics(@Query('subjectId') subjectId?: string) {
    return this.adminService.getTopics(subjectId);
  }

  @Post('content/topics')
  async createTopic(@Body() data: any) {
    return this.adminService.createTopic(data);
  }

  @Put('content/topics/:id')
  async updateTopic(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateTopic(id, data);
  }

  @Delete('content/topics/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTopic(@Param('id') id: string) {
    return this.adminService.deleteTopic(id);
  }

  // Reports
  @Get('reports/revenue')
  async getRevenueReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('groupBy') groupBy: 'day' | 'week' | 'month' = 'day',
  ) {
    return this.adminService.getRevenueReport({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      groupBy,
    });
  }

  @Get('reports/user-activity')
  async getUserActivityReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.adminService.getUserActivityReport({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
  }

  @Get('reports/exam-performance')
  async getExamPerformanceReport(
    @Query('examId') examId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.adminService.getExamPerformanceReport({
      examId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Get('reports/export')
  async exportReport(
    @Query('type') type: string,
    @Query('format') format: 'csv' | 'excel' | 'pdf' = 'csv',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.adminService.exportReport({
      type,
      format,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  // System Settings
  @Get('settings')
  async getSettings() {
    return this.adminService.getSettings();
  }

  @Put('settings')
  async updateSettings(@Body() data: any) {
    return this.adminService.updateSettings(data);
  }

  @Get('settings/maintenance')
  async getMaintenanceStatus() {
    return this.adminService.getMaintenanceStatus();
  }

  @Post('settings/maintenance')
  async setMaintenanceMode(@Body() data: { enabled: boolean; message?: string }) {
    return this.adminService.setMaintenanceMode(data.enabled, data.message);
  }

  // Audit Logs
  @Get('audit-logs')
  async getAuditLogs(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
    @Query('userId') userId?: string,
    @Query('action') action?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.adminService.getAuditLogs({
      page: Number(page),
      limit: Number(limit),
      userId,
      action,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  // Notifications
  @Post('notifications/broadcast')
  async broadcastNotification(@Body() data: {
    title: string;
    message: string;
    type: string;
    targetUsers?: string[];
    targetRoles?: string[];
  }) {
    return this.adminService.broadcastNotification(data);
  }

  @Post('notifications/email')
  async sendBulkEmail(@Body() data: {
    subject: string;
    content: string;
    targetUsers?: string[];
    targetRoles?: string[];
  }) {
    return this.adminService.sendBulkEmail(data);
  }

  // Cache Management
  @Get('cache/stats')
  async getCacheStats() {
    return this.adminService.getCacheStats();
  }

  @Post('cache/clear')
  async clearCache(@Body() data: { pattern?: string }) {
    return this.adminService.clearCache(data.pattern);
  }

  @Post('cache/warm')
  async warmCache(@Body() data: { keys: string[] }) {
    return this.adminService.warmCache(data.keys);
  }
}
