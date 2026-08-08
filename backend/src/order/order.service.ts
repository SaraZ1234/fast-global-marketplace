import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CheckoutOrderDto } from './dto/checkout-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(data: CreateOrderDto & { paymentMethod?: string }) {
    const cart = await this.prisma.cart.findUnique({
      where: {
        userId: data.userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      return {
        message: 'Cart not found',
      };
    }

    if (cart.items.length === 0) {
      return {
        message: 'Cart is empty',
      };
    }

    const total = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    const result = await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: data.userId,
          total,
          status: 'Pending',
        },
      });

      for (const item of cart.items) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          },
        });
      }

      await tx.payment.create({
        data: {
          orderId: order.id,
          amount: total,
          method: data.paymentMethod.toUpperCase(),
          status: 'Pending',
        },
      });

      for (const item of cart.items) {
        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

      return order;
    });

    return {
      message: 'Order created successfully',
      order: result,
    };
  }

  async checkout(data: CheckoutOrderDto) {
    const order = await this.createOrder({
      userId: data.userId,
      paymentMethod: data.paymentMethod,
    });

    return order;
  }

  async getAllOrders() {
    return this.prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            profileImg: true,
          },
        },

        items: {
          include: {
            product: true,
          },
        },

        payments: true,
      },
    });
  }

  async getOrderById(id: number) {
    return this.prisma.order.findUnique({
      where: {
        id,
      },

      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            profileImg: true,
          },
        },

        items: {
          include: {
            product: true,
          },
        },

        payments: true,
      },
    });
  }

  async getOrdersByUser(userId: number) {
    return this.prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async getVendorOrders(vendorId: number) {
    return this.prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              vendorId,
            },
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            profileImg: true,
          },
        },

        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async getVendorOrdersByUser(userId: number) {
    const vendor = await this.prisma.vendor.findUnique({
      where: {
        userId,
      },
    });

    if (!vendor) {
      return [];
    }

    return this.prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              vendorId: vendor.id,
            },
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            profileImg: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async updateOrderStatus(id: number, status: string) {
    return this.prisma.order.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }

  async cancelOrder(id: number) {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return {
        message: 'Order not found',
      };
    }

    if (order.status === 'Delivered') {
      return {
        message: 'Delivered orders cannot be cancelled',
      };
    }

    if (order.status === 'Cancelled') {
      return {
        message: 'Order is already cancelled',
      };
    }

    await this.prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }

      await tx.order.update({
        where: {
          id,
        },
        data: {
          status: 'Cancelled',
        },
      });
    });

    return {
      message: 'Order cancelled successfully',
    };
  }
}
