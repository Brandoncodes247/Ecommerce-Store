import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entities';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>
  ) {}

  // Simulate payment process
  async processPayment(
  orderId: number,
  amount: number,
  method = 'Mpesa',
  currency = 'KES',
  description = '',
  customerId = ''
) {
  const payment = this.paymentRepository.create({
    orderId,
    amount,
    currency,
    method,
    description,
    customerId,
    status: true,
    transactionId: 'TX-' + Date.now(), // Optional: add tracking
  });

  await this.paymentRepository.save(payment);

  return {
    success: true,
    message: `Payment for order ${orderId} processed successfully`,
    transactionId: payment.transactionId,
  };
}



  async paymentInquiry(orderId: number) {
    this.logger.log(`🔍 Checking payment status for Order ID ${orderId}`);
    return this.paymentRepository.findOne({ where: { orderId } });
  }

  private async simulateTimeout(duration: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, duration));
  }
}

