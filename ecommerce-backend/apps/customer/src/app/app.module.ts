import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerModule } from './customer.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'bigtee',
      password: 'Alpha[!]1101',
      database: 'customer_service',
      entities: [Customer],
      synchronize: true,
    }),
    CustomerModule,
  ],
})
export class AppModule {}
