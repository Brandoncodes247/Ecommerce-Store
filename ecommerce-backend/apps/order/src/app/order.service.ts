import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
  ) {}

  create(dto: CreateOrderDto) {
    const order = this.orderRepo.create({ ...dto, status: 'PENDING' });
    return this.orderRepo.save(order);
  }

  findAll() {
    return this.orderRepo.find();
  }

  findOne(id: string) {
    return this.orderRepo.findOneBy({ id });
  }

  async update(id: string, dto: UpdateOrderDto) {
    const order = await this.orderRepo.preload({ id, ...dto });
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return this.orderRepo.save(order);
  }

  async remove(id: string) {
    const order = await this.findOne(id);
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return this.orderRepo.remove(order);
  }
}
