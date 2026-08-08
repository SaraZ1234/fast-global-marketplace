import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRfqDto } from './dto/create-rfq.dto';
import { UpdateRfqDto } from './dto/update-rfq.dto';

@Injectable()
export class RfqService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateRfqDto) {
    return this.prisma.rFQ.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll() {
    return this.prisma.rFQ.findMany({
      include: {
        user: true,
        quotations: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findMy(userId: number) {
    return this.prisma.rFQ.findMany({
      where: {
        userId,
      },
      include: {
        quotations: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: number, dto: UpdateRfqDto) {
    return this.prisma.rFQ.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.rFQ.delete({
      where: {
        id,
      },
    });
  }
}
