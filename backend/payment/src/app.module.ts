import { Module } from '@nestjs/common';
import { PaymentController } from './controller/app.controller';
import { PaymentService } from './service/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Payment } from './entities/payment.entities';

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
    TypeOrmModule.forFeature([Payment]),
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'PAYMENT_SERVICE',
          inject: [ConfigService],
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: 'payment',
                brokers: [configService.get<string>('KAFKA_HOST')],
              },
              consumer: {
                groupId: 'payment-group',
              },
              // Uncomment if you need custom partitioning:
              // producer: {
              //   createPartitioner: Partitioners.DefaultPartitioner
              // }
            },
          }),
        },
      ],
    }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class AppModule {}