import {Inject, Injectable} from '@nestjs/common';
import {ClientKafka} from "@nestjs/microservices";
import {PaymentDto} from "../entities/dtos/payment.dto";


@Injectable()
export class PaymentService {
    constructor(@Inject('GATEWAY_SERVICE') private readonly gatewayService: ClientKafka) {
    }
    
    async createPayment(req: PaymentDto) {
        return this.gatewayService.send('payment_create', req);
    }
    
    async updatePayment(req: PaymentDto) {
        return this.gatewayService.send('payment_update', req);
    }
    
    async deletePayment(req: PaymentDto) {
        return this.gatewayService.send('payment_delete', req);
    }
    
    async getAllPayments(): Promise<PaymentDto[]> {
        return this.gatewayService.send<PaymentDto[]>('payment_get_all', {}).toPromise();
    }
}