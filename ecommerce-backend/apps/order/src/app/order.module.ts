import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderLine } from './entities/order-line.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderLine])], // ✅ include both
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
