import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async createReview(data: CreateReviewDto) {
    return this.prisma.review.create({
      data: {
        userId: data.userId,
        productId: data.productId,
        rating: data.rating,
        comment: data.comment,
      },
    });
  }

  async getProductReviews(productId: number) {
    return this.prisma.review.findMany({
      where: {
        productId,
      },

      include: {
        user: true,
      },
    });
  }

  async getUserReviews(userId: number) {
    return this.prisma.review.findMany({
      where: {
        userId,
      },

      include: {
        product: true,
      },
    });
  }

  async deleteReview(id: number) {
    const review = await this.prisma.review.findUnique({
      where: {
        id,
      },
    });

    if (!review) {
      return {
        message: 'Review not found',
      };
    }

    await this.prisma.review.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Review deleted successfully',
    };
  }

  async getProductRating(productId: number) {
    const reviews = await this.prisma.review.findMany({
      where: {
        productId,
      },
      select: {
        rating: true,
      },
    });

    if (reviews.length === 0) {
      return {
        productId,
        averageRating: 0,
        totalReviews: 0,
      };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);

    const averageRating = totalRating / reviews.length;

    return {
      productId,
      averageRating,
      totalReviews: reviews.length,
    };
  }
}
