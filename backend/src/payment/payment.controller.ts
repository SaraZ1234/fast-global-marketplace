import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  createPayment(@Body() data: CreatePaymentDto) {
    console.log(data);

    return this.paymentService.createPayment(data);
  }

  @Get(':orderId')
  getPayment(@Param('orderId') orderId: string) {
    return this.paymentService.getPaymentByOrder(Number(orderId));
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.paymentService.updatePaymentStatus(Number(id), body.status);
  }
}
