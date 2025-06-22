import {Body, Controller, Inject, Post,Get,Put} from "@nestjs/common";
import {ApiBody} from "@nestjs/swagger";
// import {PaymentService} from "../services/order.service";
import { PaymentService } from "../services/payment.service";
import { PaymentDto } from "../entities/dtos/payment.dto";
import {ClientKafka} from "@nestjs/microservices";

@Controller('payment')
export class PaymentController {
    constructor(@Inject() private paymentService: PaymentService, @Inject('GATEWAY_SERVICE') private readonly client: ClientKafka) {
    }

    @Post()
    @ApiBody({
        type: PaymentDto
    })
    async createPayment(@Body() req: PaymentDto) {
        return await this.paymentService.createPayment(req);
    }

    @Put()
    @ApiBody({
        type: PaymentDto
    })
    async updatePayment(@Body() req: PaymentDto) {
        return await this.paymentService.updatePayment(req);
    }

    @Get()
    async getAllPayments() {
        return await this.paymentService.getAllPayments();
    }

    async onModuleInit() {
        this.client.subscribeToResponseOf('payment_create');
        this.client.subscribeToResponseOf('payment_update');
        this.client.subscribeToResponseOf('payment_delete');
        this.client.subscribeToResponseOf('payment_get_all');
        await this.client.connect();
    }
}
