import {Body, Controller, Get, Inject, Post} from "@nestjs/common";
import {ApiBody} from "@nestjs/swagger";
import {ClientKafka} from "@nestjs/microservices";
import {InventoryDto} from "../entities/dtos/inventory.dto";
import {InventoryService} from "../services/inventory.service";

@Controller('inventory')
export class InventoryController {
    constructor(@Inject() private inventoryService: InventoryService, @Inject('GATEWAY_SERVICE') private readonly client: ClientKafka) {
    }

    @Post()
    @ApiBody({
        type: InventoryDto
    })
    async createInventory(@Body() req: InventoryDto) {
        return await this.inventoryService.createInventory(req);
    }
    @Post('reserve')
    @ApiBody({
        type: InventoryDto
    })
    async reserveInventory(@Body() req: InventoryDto) {
           
    }
    @Post('release')
    @ApiBody({
        type: InventoryDto
    })
    async releaseInventory(@Body() req: { productId: number, quantity: number }) {
        return await this.inventoryService.releaseInventory(req.productId, req.quantity);
    }
    @Get()
    async getAllInventory() {
        return await this.inventoryService.getAllInventory();
    }

    onModuleInit() {
        this.client.subscribeToResponseOf('inventory_create');
        this.client.subscribeToResponseOf('inventory_release');
        this.client.subscribeToResponseOf('inventory_get_all');
        this.client.connect()

    }

}