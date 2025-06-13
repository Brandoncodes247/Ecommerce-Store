import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'bigtee',
      password: 'Alpha[!]1101',
      database: 'customer_service',
      autoLoadEntities: true,
      synchronize: true, // false in production
    }),
  ],
})
export class AppModule {}