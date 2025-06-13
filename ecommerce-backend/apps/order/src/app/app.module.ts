import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderLine } from './entities/order-line.entity';
import { OrderModule } from './order.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'bigtee',
      password: 'Alpha[!]1101',
      database: 'order_db',
      entities: [Order, OrderLine], // ✅ include both
      synchronize: true,
    }),
    OrderModule,
  ],
})
export class AppModule {}
