import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  create(dto: CreateProductDto) {
    const product = this.productRepo.create(dto);
    return this.productRepo.save(product);
  }

  findAll() {
    return this.productRepo.find();
  }

  findOne(id: string) {
    return this.productRepo.findOneBy({ id });
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.productRepo.preload({
      id,
      ...dto,
    });

    if (!product) throw new NotFoundException(`Product ${id} not found`);

    return this.productRepo.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }
    return this.productRepo.remove(product);
  }
}
