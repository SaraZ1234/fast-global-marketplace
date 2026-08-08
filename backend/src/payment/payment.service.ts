import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async createPayment(data: CreatePaymentDto) {
    const order = await this.prisma.order.findUnique({
      where: {
        id: data.orderId,
      },
    });

    if (!order) {
      return {
        message: 'Order not found',
      };
    }

    const payment = await this.prisma.payment.create({
      data: {
        orderId: data.orderId,
        amount: data.amount,
        method: data.method,
        status: 'Pending',
      },
    });

    return {
      message: 'Payment created successfully',
      payment,
    };
  }

  async getPaymentByOrder(orderId: number) {
    return this.prisma.payment.findFirst({
      where: {
        orderId,
      },
    });
  }

  async updatePaymentStatus(id: number, status: string) {
    return this.prisma.payment.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }
}
