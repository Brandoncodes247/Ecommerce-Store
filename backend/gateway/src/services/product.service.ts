import {Inject, Injectable} from '@nestjs/common';
import {ClientKafka} from "@nestjs/microservices";
import {IProduct} from "../entities/interfaces/product.interface";
import { Observable, firstValueFrom as rxjsFirstValueFrom } from 'rxjs';

@Injectable()
export class ProductService {
  constructor(@Inject('GATEWAY_SERVICE') private readonly gatewayService:ClientKafka) {
  }
  async createProduct(req:IProduct) {
    return  this.gatewayService.send('product_create', req)
  }
  updateProduct(req:IProduct) {
    // if(!req.id){
    //   throw new Error('product id must be specified')
    // }
    return this.gatewayService.send('product_update', req)
  }
  async deleteProduct(req:IProduct) {
    // if(!req.id){
    //   throw new Error('product id must be specified')
    // }
    return  this.gatewayService.send('product_delete', req)
  }
  async getAllProducts(): Promise<IProduct[]> {
    return firstValueFrom(this.gatewayService.send<IProduct[]>('product_find_all', {}));
  }
}

function firstValueFrom<T>(observable: Observable<T>): Promise<T> {
  return rxjsFirstValueFrom(observable);
}

