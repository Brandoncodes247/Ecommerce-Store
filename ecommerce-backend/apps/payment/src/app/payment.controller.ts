import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async handlePayment(@Body() payload: { orderId: string }) {
    return this.paymentService.processPayment(payload.orderId);
  }
}
