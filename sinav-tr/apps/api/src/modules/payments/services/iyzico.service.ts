import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as Iyzipay from 'iyzipay';
import { PrismaService } from '../../../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

interface PaymentRequest {
  userId: string;
  planId: string;
  price: number;
  cardDetails: {
    cardHolderName: string;
    cardNumber: string;
    expireMonth: string;
    expireYear: string;
    cvc: string;
  };
  billingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
    zipCode: string;
  };
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  duration: number; // days
  features: string[];
  examTypes: string[];
  questionLimit?: number;
  videoAccess: boolean;
  aiFeatures: boolean;
  prioritySupport: boolean;
}

@Injectable()
export class IyzicoService {
  private iyzipay: any;
  private plans: Map<string, SubscriptionPlan>;

  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {
    // Initialize Iyzico
    this.iyzipay = Iyzipay;

    // Define subscription plans
    this.plans = new Map([
      ['free', {
        id: 'free',
        name: 'Ücretsiz Plan',
        price: 0,
        currency: 'TRY',
        duration: 365,
        features: [
          'Günde 10 soru çözme',
          'Temel konu anlatımları',
          'Basit performans takibi',
        ],
        examTypes: ['YKS-TYT'],
        questionLimit: 10,
        videoAccess: false,
        aiFeatures: false,
        prioritySupport: false,
      }],
      ['student', {
        id: 'student',
        name: 'Öğrenci Paketi',
        price: 99.99,
        currency: 'TRY',
        duration: 30,
        features: [
          'Sınırsız soru çözme',
          'Video çözümler',
          'Detaylı performans analizi',
          'AI destekli öneriler',
          'Deneme sınavları',
        ],
        examTypes: ['YKS-TYT', 'YKS-AYT'],
        questionLimit: undefined,
        videoAccess: true,
        aiFeatures: true,
        prioritySupport: false,
      }],
      ['premium', {
        id: 'premium',
        name: 'Premium Paket',
        price: 199.99,
        currency: 'TRY',
        duration: 30,
        features: [
          'Tüm Öğrenci Paketi özellikleri',
          'KPSS soruları',
          'Canlı ders desteği',
          'Birebir mentörlük (ayda 2 saat)',
          'Öncelikli destek',
          'Özel deneme sınavları',
        ],
        examTypes: ['YKS-TYT', 'YKS-AYT', 'KPSS'],
        questionLimit: undefined,
        videoAccess: true,
        aiFeatures: true,
        prioritySupport: true,
      }],
      ['yearly', {
        id: 'yearly',
        name: 'Yıllık Paket',
        price: 999.99,
        currency: 'TRY',
        duration: 365,
        features: [
          'Tüm Premium özellikler',
          '12 ay erişim',
          '%60 indirim',
          'Sınırsız mentörlük',
          'Özel içerikler',
        ],
        examTypes: ['YKS-TYT', 'YKS-AYT', 'KPSS'],
        questionLimit: undefined,
        videoAccess: true,
        aiFeatures: true,
        prioritySupport: true,
      }],
    ]);
  }

  async createPayment(paymentRequest: PaymentRequest): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: paymentRequest.userId },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const plan = this.plans.get(paymentRequest.planId);
    if (!plan) {
      throw new HttpException('Invalid plan', HttpStatus.BAD_REQUEST);
    }

    // Generate unique conversation ID
    const conversationId = `${Date.now()}-${paymentRequest.userId}`;

    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: conversationId,
      price: plan.price.toString(),
      paidPrice: plan.price.toString(),
      currency: Iyzipay.CURRENCY.TRY,
      installment: '1',
      basketId: `B${Date.now()}`,
      paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
      paymentGroup: Iyzipay.PAYMENT_GROUP.SUBSCRIPTION,
      paymentCard: {
        cardHolderName: paymentRequest.cardDetails.cardHolderName,
        cardNumber: paymentRequest.cardDetails.cardNumber,
        expireMonth: paymentRequest.cardDetails.expireMonth,
        expireYear: paymentRequest.cardDetails.expireYear,
        cvc: paymentRequest.cardDetails.cvc,
        registerCard: '0',
      },
      buyer: {
        id: user.id,
        name: user.name.split(' ')[0] || 'Ad',
        surname: user.name.split(' ')[1] || 'Soyad',
        gsmNumber: '+905350000000', // Should come from user profile
        email: user.email,
        identityNumber: '11111111111', // Should be collected during registration
        lastLoginDate: user.updatedAt.toISOString().split('T')[0],
        registrationDate: user.createdAt.toISOString().split('T')[0],
        registrationAddress: paymentRequest.billingAddress.address,
        ip: '85.34.78.112', // Should get from request
        city: paymentRequest.billingAddress.city,
        country: paymentRequest.billingAddress.country,
        zipCode: paymentRequest.billingAddress.zipCode,
      },
      shippingAddress: paymentRequest.billingAddress,
      billingAddress: paymentRequest.billingAddress,
      basketItems: [
        {
          id: plan.id,
          name: plan.name,
          category1: 'Eğitim',
          category2: 'Online Kurs',
          itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
          price: plan.price.toString(),
        },
      ],
    };

    return new Promise((resolve, reject) => {
      this.iyzipay.payment.create(request, async (err: any, result: any) => {
        if (err) {
          console.error('Iyzico payment error:', err);
          reject(new HttpException('Payment failed', HttpStatus.PAYMENT_REQUIRED));
          return;
        }

        if (result.status === 'success') {
          // Save payment record
          const payment = await this.prisma.payment.create({
            data: {
              userId: paymentRequest.userId,
              planId: plan.id,
              plan: plan.id === 'free' ? 'FREE' : plan.id === 'student' ? 'PRO' : 'PLUS',
              amount: plan.price,
              currency: plan.currency,
              status: 'SUCCESS',
              paymentId: result.paymentId,
              conversationId: conversationId,
              paymentDetails: result,
            },
          });

          // Create or update subscription
          const startDate = new Date();
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + plan.duration);

          await this.prisma.subscription.upsert({
            where: { userId: paymentRequest.userId },
            update: {
              planId: plan.id,
              status: 'ACTIVE',
              startDate: startDate,
              endDate: endDate,
              autoRenew: true,
            },
            create: {
              userId: paymentRequest.userId,
              planId: plan.id,
              status: 'ACTIVE',
              startDate: startDate,
              endDate: endDate,
              autoRenew: true,
            },
          });

          // Emit payment success event
          this.eventEmitter.emit('payment.success', {
            userId: paymentRequest.userId,
            planId: plan.id,
            paymentId: payment.id,
          });

          resolve({
            success: true,
            paymentId: payment.id,
            subscription: {
              planId: plan.id,
              startDate,
              endDate,
            },
          });
        } else {
          // Save failed payment attempt
          await this.prisma.payment.create({
            data: {
              userId: paymentRequest.userId,
              planId: plan.id,
              plan: plan.id === 'free' ? 'FREE' : plan.id === 'student' ? 'PRO' : 'PLUS',
              amount: plan.price,
              currency: plan.currency,
              status: 'FAILED',
              conversationId: conversationId,
              errorMessage: result.errorMessage,
              paymentDetails: result,
            },
          });

          reject(new HttpException(
            result.errorMessage || 'Payment failed',
            HttpStatus.PAYMENT_REQUIRED,
          ));
        }
      });
    });
  }

  async createCheckoutForm(userId: string, planId: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const plan = this.plans.get(planId);
    if (!plan) {
      throw new HttpException('Invalid plan', HttpStatus.BAD_REQUEST);
    }

    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: `${Date.now()}-${userId}`,
      price: plan.price.toString(),
      paidPrice: plan.price.toString(),
      currency: Iyzipay.CURRENCY.TRY,
      basketId: `B${Date.now()}`,
      paymentGroup: Iyzipay.PAYMENT_GROUP.SUBSCRIPTION,
      callbackUrl: `${process.env.FRONTEND_URL}/payment/callback`,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: user.id,
        name: user.name.split(' ')[0] || 'Ad',
        surname: user.name.split(' ')[1] || 'Soyad',
        gsmNumber: '+905350000000',
        email: user.email,
        identityNumber: '11111111111',
        registrationAddress: 'Türkiye',
        ip: '85.34.78.112',
        city: 'Istanbul',
        country: 'Turkey',
      },
      shippingAddress: {
        contactName: user.name,
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Türkiye',
      },
      billingAddress: {
        contactName: user.name,
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Türkiye',
      },
      basketItems: [
        {
          id: plan.id,
          name: plan.name,
          category1: 'Eğitim',
          category2: 'Online Kurs',
          itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
          price: plan.price.toString(),
        },
      ],
    };

    return new Promise((resolve, reject) => {
      this.iyzipay.checkoutFormInitialize.create(request, (err: any, result: any) => {
        if (err) {
          console.error('Iyzico checkout form error:', err);
          reject(new HttpException('Failed to create checkout form', HttpStatus.INTERNAL_SERVER_ERROR));
          return;
        }

        if (result.status === 'success') {
          resolve({
            success: true,
            checkoutFormContent: result.checkoutFormContent,
            token: result.token,
          });
        } else {
          reject(new HttpException(
            result.errorMessage || 'Failed to create checkout form',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ));
        }
      });
    });
  }

  async verifyPayment(token: string): Promise<any> {
    const request = {
      locale: Iyzipay.LOCALE.TR,
      token: token,
    };

    return new Promise((resolve, reject) => {
      this.iyzipay.checkoutForm.retrieve(request, async (err: any, result: any) => {
        if (err) {
          console.error('Iyzico verification error:', err);
          reject(new HttpException('Payment verification failed', HttpStatus.BAD_REQUEST));
          return;
        }

        if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {
          // Extract user and plan info from basketItems
          const basketItem = result.itemTransactions[0];
          const planId = basketItem.itemId;
          const plan = this.plans.get(planId);

          if (!plan) {
            reject(new HttpException('Invalid plan in payment', HttpStatus.BAD_REQUEST));
            return;
          }

          // Update payment and subscription
          const payment = await this.prisma.payment.create({
            data: {
              userId: result.buyerId,
              planId: planId,
              plan: plan.name as any,
              amount: parseFloat(result.paidPrice),
              currency: result.currency,
              status: 'SUCCESS',
              paymentId: result.paymentId,
              conversationId: result.conversationId,
              paymentDetails: result,
            },
          });

          // Create or update subscription
          const startDate = new Date();
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + plan.duration);

          await this.prisma.subscription.upsert({
            where: { userId: result.buyerId },
            update: {
              planId: planId,
              status: 'ACTIVE',
              startDate: startDate,
              endDate: endDate,
              autoRenew: true,
            },
            create: {
              userId: result.buyerId,
              planId: planId,
              status: 'ACTIVE',
              startDate: startDate,
              endDate: endDate,
              autoRenew: true,
            },
          });

          resolve({
            success: true,
            paymentId: payment.id,
            subscription: {
              planId: planId,
              startDate,
              endDate,
            },
          });
        } else {
          reject(new HttpException(
            result.errorMessage || 'Payment verification failed',
            HttpStatus.PAYMENT_REQUIRED,
          ));
        }
      });
    });
  }

  async cancelSubscription(userId: string): Promise<void> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new HttpException('No active subscription found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.subscription.update({
      where: { userId },
      data: {
        status: 'CANCELLED',
        autoRenew: false,
        cancelledAt: new Date(),
      },
    });

    this.eventEmitter.emit('subscription.cancelled', {
      userId,
      subscriptionId: subscription.id,
    });
  }

  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return Array.from(this.plans.values());
  }

  async getUserSubscription(userId: string): Promise<any> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      return {
        active: false,
        plan: this.plans.get('free'),
      };
    }

    const plan = this.plans.get(subscription.planId);
    const now = new Date();
    const isActive = subscription.status === 'ACTIVE' && subscription.endDate && subscription.endDate > now;

    return {
      active: isActive,
      plan: plan,
      subscription: {
        ...subscription,
        daysRemaining: subscription.endDate ? Math.max(0, Math.floor((subscription.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0,
      },
    };
  }

  async processRefund(paymentId: string, reason: string): Promise<any> {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
    }

    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: `refund-${Date.now()}`,
      paymentTransactionId: payment.paymentId,
      price: payment.amount.toString(),
      currency: Iyzipay.CURRENCY.TRY,
      ip: '85.34.78.112',
    };

    return new Promise((resolve, reject) => {
      this.iyzipay.refund.create(request, async (err: any, result: any) => {
        if (err) {
          console.error('Iyzico refund error:', err);
          reject(new HttpException('Refund failed', HttpStatus.INTERNAL_SERVER_ERROR));
          return;
        }

        if (result.status === 'success') {
          // Update payment status
          await this.prisma.payment.update({
            where: { id: paymentId },
            data: {
              status: 'REFUNDED',
              refundedAt: new Date(),
              refundReason: reason,
            },
          });

          // Cancel subscription
          await this.prisma.subscription.update({
            where: { userId: payment.userId },
            data: {
              status: 'CANCELLED',
              cancelledAt: new Date(),
            },
          });

          this.eventEmitter.emit('payment.refunded', {
            paymentId,
            userId: payment.userId,
            amount: payment.amount,
          });

          resolve({
            success: true,
            refundId: result.paymentId,
          });
        } else {
          reject(new HttpException(
            result.errorMessage || 'Refund failed',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ));
        }
      });
    });
  }
}
