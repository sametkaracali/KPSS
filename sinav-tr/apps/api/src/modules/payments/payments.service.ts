import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  async getPlans() {
    // TODO: Implement get subscription plans
    // Return: Free, Pro, Plus plans with features
    return [
      {
        id: 'free',
        name: 'Ücretsiz',
        price: 0,
        features: ['Tüm ders anlatımları', 'Soru bankası', 'Temel deneme sınavları'],
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 99,
        features: ['Ücretsiz özellikleri', 'Gelişmiş analitik', 'Adaptif çalışma planı'],
      },
      {
        id: 'plus',
        name: 'Plus',
        price: 169,
        features: ['Pro özellikleri', 'Erken erişim denemeler', 'Çözüm videoları'],
      },
    ];
  }

  async createSubscription(userId: string, planId: string, paymentMethod: any) {
    // TODO: Implement subscription creation
    // 1. Validate plan
    // 2. Create payment with Iyzico
    // 3. Create subscription in database
    // 4. Update user subscription
    // 5. Return payment info
    return { payment: {} };
  }

  async handleIyzicoWebhook(data: any) {
    // TODO: Implement Iyzico webhook handler
    // 1. Verify webhook signature
    // 2. Update payment status
    // 3. Update subscription if successful
    // 4. Send confirmation email
    return { success: true };
  }

  async getUserSubscription(userId: string) {
    // TODO: Implement get user subscription
    // 1. Find user subscription
    // 2. Check if active
    // 3. Return subscription details
    return null;
  }

  async cancelSubscription(userId: string) {
    // TODO: Implement cancel subscription
    // 1. Find subscription
    // 2. Mark as inactive
    // 3. Set end date
    // 4. Downgrade to free plan
    // 5. Send cancellation email
    return { message: 'Subscription cancelled' };
  }

  async getUserPayments(userId: string) {
    // TODO: Implement get user payment history
    // 1. Get all payments for user
    // 2. Sort by date
    // 3. Return payments
    return [];
  }

  async verifyPayment(transactionId: string) {
    // TODO: Implement payment verification with Iyzico
    // 1. Call Iyzico API
    // 2. Verify transaction
    // 3. Return status
    return { verified: false };
  }
}
