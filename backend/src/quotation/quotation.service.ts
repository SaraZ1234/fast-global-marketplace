import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';

@Injectable()
export class QuotationService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateQuotationDto) {
    const vendor = await this.prisma.vendor.findUnique({
      where: {
        userId,
      },
    });

    if (!vendor) {
      throw new Error('Vendor not found');
    }

    return this.prisma.quotation.create({
      data: {
        rfqId: dto.rfqId,
        vendorId: vendor.id,
        price: dto.price,
        message: dto.message,
      },
    });
  }

  async findAllRfqs() {
    return this.prisma.rFQ.findMany({
      where: {
        status: 'Open',
      },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findMyQuotations(userId: number) {
    const vendor = await this.prisma.vendor.findUnique({
      where: {
        userId,
      },
    });

    if (!vendor) {
      throw new Error('Vendor not found');
    }

    return this.prisma.quotation.findMany({
      where: {
        vendorId: vendor.id,
      },
      include: {
        rfq: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByRfq(rfqId: number) {
    return this.prisma.quotation.findMany({
      where: {
        rfqId,
      },
      include: {
        vendor: {
          select: {
            companyName: true,
            companyEmail: true,
            phone: true,
            rating: true,
          },
        },
      },
      orderBy: {
        price: 'asc',
      },
    });
  }
}
