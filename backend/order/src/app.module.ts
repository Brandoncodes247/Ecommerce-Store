import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { OrderService } from './service/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderLog } from './entities/log.entity';
import { Order } from './entities/order.entities';
import { Product } from './entities/product.entity';
import { OrderItem } from './entities/order-item.entity'; // ✅ Added

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT')),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([OrderLog, Order, Product, OrderItem]), // ✅ Included OrderItem
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'ORDER_SERVICE',
          inject: [ConfigService],
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: 'order',
                brokers: [configService.get<string>('KAFKA_HOST')],
              },
              consumer: {
                groupId: 'order-group',
              },
            },
          }),
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [OrderService],
})
export class AppModule {}
