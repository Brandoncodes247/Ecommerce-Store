import {Inject, Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Inventory} from "../entities/inventory.entity";
import {EntityManager, Repository} from "typeorm";
import * as retry from 'async-retry'
import {IOrder} from "../entities/interface/order.interface";
import {OrderLog, ProcessCommand, ProcessStatus} from "../entities/log.entity";
import {ClientKafka} from "@nestjs/microservices";

const INVENTORY_RESERVE_RETRIES = 6;

@Injectable()
export class InventoryService {
    private readonly logger = new Logger(InventoryService.name);

    constructor(
        @InjectRepository(Inventory) private inventoryRepository: Repository<Inventory>,
        @InjectRepository(OrderLog) private orderLogRepository: Repository<OrderLog>,
        @Inject('INVENTORY_SERVICE') private inventoryBrokerServices: ClientKafka
    ) {}

    private async createOrderLog(orderId: number, command: ProcessCommand, status: ProcessStatus, errorMessage?: string) {
        const log = new OrderLog();
        log.orderId = orderId;
        log.command = command;
        log.processedAt = new Date();
        log.status = status;
        if (errorMessage) log.errorMessage = errorMessage;
        await this.orderLogRepository.save(log);
        return log;
    }

    async reserveInventory(order: IOrder) {
        try {
            this.logger.log(`Checking if orderId ${order.id} reservation was already processed`);
            const inventoryProcess = await this.orderLogRepository.findOne({
                where: {
                    command: ProcessCommand.RESERVE,
                    status: ProcessStatus.SUCCESS,
                    orderId: order.id
                }
            });
            if (inventoryProcess) {
                this.logger.warn(`Duplicate inventory reservation request for orderId: ${order.id}`);
                // Only emit event, do not create a new log for duplicates
                await this.inventoryBrokerServices.emit('order_payment', order);
                return;
            }

            await retry(
                async (bail, attempt) => {
                    let log: OrderLog | undefined;
                    try {
                        this.logger.log(`Inventory reservation attempt #${attempt} for orderId: ${order.id}`);
                        if (attempt >= INVENTORY_RESERVE_RETRIES) {
                            this.logger.error(`Max retry attempts reached for orderId: ${order.id}. Marking as FAILED.`);
                            await this.createOrderLog(order.id, ProcessCommand.RESERVE, ProcessStatus.FAILED, 'Max retry attempts reached');
                            await this.inventoryBrokerServices.emit('order_failed', {orderId: order.id});
                            return;
                        }
                        await this.inventoryRepository.manager.transaction(async (transactionalEntityManager: EntityManager) => {
                            const inventory = await transactionalEntityManager.createQueryBuilder(Inventory, 'inventory')
                                .setLock('pessimistic_write')
                                .where('inventory.product = :product', {product: order.product.id})
                                .getOne();
                            if (!inventory) {
                                const errorMsg = `Inventory for product id: ${order.product.id} not found`;
                                log = await this.createOrderLog(order.id, ProcessCommand.RESERVE, ProcessStatus.FAILED, errorMsg);
                                throw new Error(errorMsg);
                            }
                            if (inventory.quantity >= order.quantity) {
                                inventory.quantity -= order.quantity;
                                await transactionalEntityManager.save(inventory);
                                log = await this.createOrderLog(order.id, ProcessCommand.RESERVE, ProcessStatus.SUCCESS);
                                this.logger.log(`Product reservation successful for orderId: ${order.id}`);
                            } else {
                                const errorMsg = `Insufficient inventory for orderId:${order.id}, available: ${inventory.quantity}`;
                                log = await this.createOrderLog(order.id, ProcessCommand.RESERVE, ProcessStatus.FAILED, errorMsg);
                                throw new Error(errorMsg);
                            }
                        });
                        // Emit event only after successful transaction and log save
                        if (log && log.status === ProcessStatus.SUCCESS) {
                            await this.inventoryBrokerServices.emit('order_payment', {
                                orderId: order.id,
                                amount: order.quantity * order.product.price
                            });
                            this.logger.log(`Event emitted for order_payment`);
                        }
                    } catch (e) {
                        this.logger.error(`Error in reservation attempt #${attempt} for orderId: ${order.id}: ${e.message}`);
                        throw e;
                    }
                },
                {
                    retries: INVENTORY_RESERVE_RETRIES,
                }
            );
        } catch (e) {
            this.logger.error(`Reservation failed for orderId: ${order.id}: ${e.message}`);
            return {error: 'Inventory reservation failed. Please try again later.'};
        }
    }

    async createInventory(inventory: Inventory) {
        try {
            return await this.inventoryRepository.save(inventory);
        } catch (e) {
            this.logger.error(`Error creating inventory: ${e.message}`);
            return {error: 'Failed to create inventory.'};
        }
    }

    async releaseInventory(productId: number, quantity: number) {
        if (productId && quantity) {
            try {
                await this.inventoryRepository.createQueryBuilder()
                    .update(Inventory)
                    .set({ quantity: () => `quantity + ${quantity}` })
                    .where(`product = :productId`, {productId})
                    .execute();
                this.logger.log(`Released ${quantity} units for productId: ${productId}`);
            } catch (e) {
                this.logger.error(`Error releasing inventory for productId: ${productId}: ${e.message}`);
                throw new Error('Failed to release inventory.');
            }
        } else {
            this.logger.warn('Invalid productId or quantity provided to releaseInventory.');
        }
    }
    async getAllInventory(): Promise<Inventory[]> {
        try {
            return await this.inventoryRepository.find({
            relations: ['product'],
            select: ['id', 'quantity', 'product']
        });
        } catch (error) {
        this.logger.error(`Error fetching inventory: ${error.message}`);
        throw new Error('Failed to fetch inventory data.');
        }
    }
    async reserveBatchInventory(
        orderId: number, 
        items: { productId: number; quantity: number; price: number }[]
        ) {
        try {
            for (const item of items) {
            await this.inventoryRepository.decrement(
                { product: { id: item.productId } }, 
                'quantity', 
                item.quantity
            );
            }

            await this.inventoryBrokerServices.emit('order_payment', {
            orderId,
            amount: items.reduce((total, item) => total + item.price * item.quantity, 0)
            });

            return { success: true };
        } catch (err) {
            console.error(`Failed to reserve inventory for order ${orderId}:`, err);
            await this.inventoryBrokerServices.emit('order_failed', { orderId });
            return { success: false, error: err.message };
        }
    }
}
