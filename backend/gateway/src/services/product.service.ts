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
  async getAllProducts(): Promise<any[]> {
    const products = await firstValueFrom(
      this.gatewayService.send<any[]>('product_find_all', {})
    );

    const inventoryList = await firstValueFrom(
      this.gatewayService.send<any[]>('inventory_get_all', {})
    );

    const inventoryMap = new Map(inventoryList.map(i => [i.product, i.quantity]));

    return products.map(product => ({
      ...product,
      quantity: inventoryMap.get(product.id) ?? 0
    }));
  }

}

function firstValueFrom<T>(observable: Observable<T>): Promise<T> {
  return rxjsFirstValueFrom(observable);
}

