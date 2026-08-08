import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Injectable()
export class VendorService {
  constructor(private prisma: PrismaService) {}

  createVendor(data: CreateVendorDto) {
    console.log(data);

    return this.prisma.vendor.create({
      data: {
        companyName: data.companyName,
        companyEmail: data.companyEmail,
        phone: data.phone,
        address: data.address,
        logo: data.logo,
        description: data.description,
        status: 'Pending',
        userId: data.userId,
      },
    });
  }

  findAll() {
    return this.prisma.vendor.findMany({
      include: {
        user: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.vendor.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });
  }

  updateVendor(id: number, data: UpdateVendorDto) {
    return this.prisma.vendor.update({
      where: {
        id,
      },
      data,
    });
  }

  deleteVendor(id: number) {
    return this.prisma.vendor.delete({
      where: {
        id,
      },
    });
  }

  approveVendor(id: number) {
    return this.prisma.vendor.update({
      where: {
        id,
      },
      data: {
        status: 'Approved',
      },
    });
  }

  rejectVendor(id: number) {
    return this.prisma.vendor.update({
      where: {
        id,
      },
      data: {
        status: 'Rejected',
      },
    });
  }

  async findPublicVendors() {
    return this.prisma.vendor.findMany({
      where: {
        verified: true,
        status: 'Approved',
      },
      select: {
        id: true,
        companyName: true,
        country: true,
        logo: true,
        description: true,
        rating: true,
        yearsInBusiness: true,
      },
    });
  }

  async findPublicVendor(id: number) {
    return this.prisma.vendor.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        companyName: true,
        companyEmail: true,
        phone: true,
        country: true,
        logo: true,
        description: true,
        website: true,
        rating: true,
        yearsInBusiness: true,
        verified: true,
        products: true,
      },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.vendor.findUnique({
      where: {
        userId,
      },
      include: {
        products: true,
      },
    });
  }
}
