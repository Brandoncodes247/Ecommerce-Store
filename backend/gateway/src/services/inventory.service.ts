import {Inject, Injectable} from '@nestjs/common';
import {ClientKafka} from "@nestjs/microservices";
import {OrderDto} from "../entities/dtos/order.dto";
import {InventoryDto} from "../entities/dtos/inventory.dto";

@Injectable()
export class InventoryService {
  constructor(@Inject('GATEWAY_SERVICE') private readonly gatewayService:ClientKafka) {
  }
  async createInventory(req:InventoryDto) {
    return  this.gatewayService.send('inventory_create', req)
  }
  async reserveInventory(order: OrderDto) {
    return this.gatewayService.emit('inventory_new_order', {order});
  }
  async releaseInventory(productId: number, quantity: number) {
    return this.gatewayService.emit('inventory_release', {productId, quantity});
  }
  async getAllInventory(): Promise<InventoryDto[]> {
    return this.gatewayService.send<InventoryDto[]>('inventory_get_all', {}).toPromise();
  }
}
