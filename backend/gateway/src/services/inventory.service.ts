import {Inject, Injectable} from '@nestjs/common';
import {ClientKafka} from "@nestjs/microservices";
import {OrderDto} from "../entities/dtos/order.dto";
import {IInventory} from "../entities/interfaces/inventory.interface";
import { firstValueFrom } from 'rxjs';

@Injectable()
export class InventoryService {
  constructor(@Inject('GATEWAY_SERVICE') private readonly gatewayService:ClientKafka) {
  }
  async createInventory(req:IInventory) {
    return  this.gatewayService.send('inventory_create', req)
  }
  async reserveInventory(order: OrderDto) {
    return this.gatewayService.emit('inventory_new_order', {order});
  }
  async releaseInventory(productId: number, quantity: number) {
    return this.gatewayService.emit('inventory_release', {productId, quantity});
  }
  async getAllInventory(): Promise<IInventory[]> {
    return firstValueFrom(
      this.gatewayService.send<IInventory[]>('inventory_get_all', {})
    );
  }
  

}
