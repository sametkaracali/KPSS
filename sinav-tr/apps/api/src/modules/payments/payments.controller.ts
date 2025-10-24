import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}
  @Get('plans')
  async getPlans() {
    const plans = await this.paymentsService.getPlans();
    return { plans };
  }

  @Post('subscribe')
  @HttpCode(HttpStatus.CREATED)
  async subscribe(@Body() body: any) {
    // TODO: Implement subscription
    return { message: 'Subscription created', payment: {} };
  }

  @Post('webhook/iyzico')
  @HttpCode(HttpStatus.OK)
  async handleIyzicoWebhook(@Body() body: any) {
    // TODO: Implement Iyzico webhook handler
    return { message: 'Webhook processed' };
  }

  @Get('user/:userId/subscription')
  async getUserSubscription(@Param('userId') userId: string) {
    // TODO: Implement get user subscription
    return { subscription: {} };
  }

  @Post('cancel-subscription')
  @HttpCode(HttpStatus.OK)
  async cancelSubscription(@Body() body: any) {
    // TODO: Implement cancel subscription
    return { message: 'Subscription cancelled' };
  }

  @Get('user/:userId/payments')
  async getUserPayments(@Param('userId') userId: string) {
    // TODO: Implement get user payment history
    return { payments: [] };
  }
}
