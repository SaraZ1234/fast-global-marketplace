import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post()
  createReview(@Body() data: CreateReviewDto) {
    console.log('REVIEW BODY:');
    console.log(data);

    return this.reviewService.createReview(data);
  }

  @Get('product/:productId')
  getProductReviews(@Param('productId') productId: string) {
    return this.reviewService.getProductReviews(Number(productId));
  }

  @Get('user/:userId')
  getUserReviews(@Param('userId') userId: string) {
    return this.reviewService.getUserReviews(Number(userId));
  }

  @Delete(':id')
  deleteReview(@Param('id') id: string) {
    return this.reviewService.deleteReview(Number(id));
  }

  @Get('product/:productId/rating')
  getProductRating(@Param('productId') productId: string) {
    return this.reviewService.getProductRating(Number(productId));
  }
}
