import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}
  async createCategory(createCategoryDto: CreateCategoryDto) {
    return await this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async getAllCategories() {
  const categories = await this.prisma.category.findMany({
    orderBy: {
      id: 'asc',
    },
  });

  console.log("CATEGORY API - DATABASE RESULT:", categories.length);
  console.log(
    "CATEGORY API - IDS:",
    categories.map((category) => category.id),
  );

  return categories;
}

  async getCategoryById(id: number) {
    return await this.prisma.category.findUnique({
      where: {
        id,
      },
    });
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
  return await this.prisma.category.update({
    where: {
      id,
    },
    data: updateCategoryDto,
  });
}

async deleteCategory(id: number) {
  return await this.prisma.category.delete({
    where: {
      id,
    },
  });
}
}
