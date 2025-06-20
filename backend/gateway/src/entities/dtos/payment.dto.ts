import {ApiProperty} from "@nestjs/swagger";
import {PaymentDetails,PaymentResult} from "../interfaces/payment.interface";

export class PaymentDto implements PaymentDetails {
    @ApiProperty({ example: 100, description: 'Amount to be paid' })
    amount: number;

    @ApiProperty({ example: 'USD', description: 'Currency of the payment' })
    currency: string;

    @ApiProperty({ example: 'credit_card', description: 'Payment method used' })
    method: 'credit_card' | 'paypal' | 'bank_transfer';

    @ApiProperty({ example: 'Payment for order #12345', description: 'Description of the payment' })
    description?: string;

    @ApiProperty({ example: 'cust_12345', description: 'Customer ID associated with the payment' })
    customerId?: string;
}