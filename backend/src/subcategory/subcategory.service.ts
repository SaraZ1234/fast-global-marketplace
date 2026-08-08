import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubCategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubCategoryDto } from './dto/update-subcategory.dto';

@Injectable()
export class SubCategoryService {

  constructor(
    private prisma: PrismaService,
  ) {}

  createSubCategory(data: CreateSubCategoryDto) {

    console.log(data);

    return this.prisma.subCategory.create({
      data,
    });

  }

  findAll() {
  return this.prisma.subCategory.findMany({
    include: {
      category: true,
    },
  });
}



findOne(id: number) {
  return this.prisma.subCategory.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
    },
  });
}

updateSubCategory(
  id: number,
  data: UpdateSubCategoryDto,
) {
  return this.prisma.subCategory.update({
    where: {
      id,
    },
    data,
  });
}


deleteSubCategory(id: number) {
  return this.prisma.subCategory.delete({
    where: {
      id,
    },
  });
}

}