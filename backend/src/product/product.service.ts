import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  createProduct(data: CreateProductDto) {
    console.log(data);

    return this.prisma.product.create({
      data: {
        name: data.name,

        slug: data.name.toLowerCase().replace(/\s+/g, '-'),

        description: data.description,
        price: data.price,
        stock: data.stock,
        vendorId: data.vendorId,
        categoryId: data.categoryId,
        subCategoryId: data.subCategoryId,
        status: 'Pending',
      },
    });
  }

  findAll() {
    return this.prisma.product.findMany({
      include: {
        vendor: true,
        category: true,
        subCategory: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        vendor: true,
        category: true,
        subCategory: true,
      },
    });
  }

  updateProduct(id: number, data: UpdateProductDto) {
    return this.prisma.product.update({
      where: {
        id,
      },
      data,
    });
  }

  deleteProduct(id: number) {
    return this.prisma.product.delete({
      where: {
        id,
      },
    });
  }

  approveProduct(id: number) {
    return this.prisma.product.update({
      where: {
        id,
      },
      data: {
        status: 'Approved',
      },
    });
  }

  rejectProduct(id: number) {
    return this.prisma.product.update({
      where: {
        id,
      },
      data: {
        status: 'Rejected',
      },
    });
  }
}
