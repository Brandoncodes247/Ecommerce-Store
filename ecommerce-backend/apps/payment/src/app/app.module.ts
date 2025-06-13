import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { KafkaService } from './kafka/kafka.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, KafkaService],
})
export class AppModule {}
