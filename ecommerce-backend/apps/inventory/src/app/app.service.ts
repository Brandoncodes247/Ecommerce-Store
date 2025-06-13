import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepo: Repository<Inventory>,
  ) {}

  create(dto: CreateInventoryDto) {
    const inventory = this.inventoryRepo.create(dto);
    return this.inventoryRepo.save(inventory);
  }

  findAll() {
    return this.inventoryRepo.find();
  }

  findOne(id: string) {
    return this.inventoryRepo.findOne({ where: { id } });
  }

  update(id: string, dto: UpdateInventoryDto) {
    return this.inventoryRepo.update(id, dto);
  }

  remove(id: string) {
    return this.inventoryRepo.delete(id);
  }

  async decrease(productId: string, quantity: number) {
    const inventory = await this.inventoryRepo.findOne({ where: { productId } });
    if (!inventory || inventory.quantity < quantity) {
      throw new Error('Not enough stock');
    }
    inventory.quantity -= quantity;
    return this.inventoryRepo.save(inventory);
  }
}
