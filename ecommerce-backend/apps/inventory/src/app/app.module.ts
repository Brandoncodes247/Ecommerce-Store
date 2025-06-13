import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'bigtee',
      password: 'Alpha[!]1101',
      database: 'inventory_db',
      entities: [Inventory],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Inventory]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
