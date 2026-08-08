import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // Get all users
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        profileImg: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        role: true,
        orders: true,
      },
    });
  }

  // Update user status
  async updateUserStatus(id: number, status: boolean) {
    return this.prisma.user.update({
      where: {
        id,
      },

      data: {
        status,
      },
    });
  }

  // Get pending vendors
  async getPendingVendors() {
    return this.prisma.vendor.findMany({
      where: {
        status: 'Pending',
      },

      include: {
        user: true,
      },
    });
  }

  // Approve vendor
  async approveVendor(id: number) {
    return this.prisma.vendor.update({
      where: {
        id,
      },

      data: {
        status: 'Approved',
      },
    });
  }

  // Get pending products
  async getPendingProducts() {
    return this.prisma.product.findMany({
      where: {
        status: 'Pending',
      },

      include: {
        vendor: true,
        category: true,
      },
    });
  }

  // Get all products
  async getAllProducts() {
    return this.prisma.product.findMany({
      include: {
        vendor: {
          include: {
            user: true,
          },
        },
        category: true,
        subCategory: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Approve product
  async approveProduct(id: number) {
    return this.prisma.product.update({
      where: {
        id,
      },

      data: {
        status: 'Approved',
      },
    });
  }

  async rejectVendor(id: number) {
    return this.prisma.vendor.update({
      where: {
        id,
      },
      data: {
        status: 'Rejected',
      },
    });
  }

  async rejectProduct(id: number) {
    return this.prisma.product.update({
      where: {
        id,
      },
      data: {
        status: 'Rejected',
      },
    });
  }

  // Get all orders
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

  // Update order status
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

  async getDashboard() {
    const users = await this.prisma.user.count();

    const vendors = await this.prisma.vendor.count();

    const products = await this.prisma.product.count();

    const orders = await this.prisma.order.count();

    const revenue = await this.prisma.order.aggregate({
      _sum: {
        total: true,
      },

      where: {
        status: 'Delivered',
      },
    });

    const pendingProducts = await this.prisma.product.count({
      where: {
        status: 'Pending',
      },
    });

    const pendingVendors = await this.prisma.vendor.count({
      where: {
        status: 'Pending',
      },
    });

    return {
      users,

      vendors,

      products,

      orders,

      revenue: revenue._sum.total || 0,

      pendingProducts,

      pendingVendors,
    };
  }

  // Get all payments
  async getAllPayments() {
    return this.prisma.payment.findMany({
      include: {
        order: {
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
        },
      },
    });
  }

  // Update payment status
  // Update payment status
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

  async getAllVendors() {
    return this.prisma.vendor.findMany({
      include: {
        user: true,
        products: true,
      },
    });
  }
}
