import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async addWishlist(data: CreateWishlistDto) {
    const existing = await this.prisma.wishlist.findFirst({
      where: {
        userId: data.userId,
        productId: data.productId,
      },
    });

    if (existing) {
      return {
        message: 'Product already in wishlist',
      };
    }

    return this.prisma.wishlist.create({
      data: {
        userId: data.userId,
        productId: data.productId,
      },
    });
  }

  async getMyWishlist(userId: number) {
    return this.prisma.wishlist.findMany({
      where: {
        userId,
      },

      include: {
        product: true,
      },
    });
  }

  async removeWishlist(userId: number, productId: number) {
    return this.prisma.wishlist.deleteMany({
      where: {
        userId,
        productId,
      },
    });
  }

  //using
  async remove(userId:number, productId:number){

  return this.prisma.wishlist.deleteMany({
    where:{
      userId,
      productId
    }
  });

}
}
