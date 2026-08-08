import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Req,
  UseGuards,Request
} from '@nestjs/common';

import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtGuard } from '../auth/jwt/jwt.guard';
@Controller('wishlist')
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  // Add wishlist
  @Post()
  addWishlist(@Body() data: CreateWishlistDto) {
    return this.wishlistService.addWishlist(data);
  }

  // Get logged-in user's wishlist
  @UseGuards(JwtGuard)
  @Get('my')
  getMyWishlist(@Req() req) {
    const userId = req.user.id;

    return this.wishlistService.getMyWishlist(userId);
  }

  // Remove from wishlist
  @UseGuards(JwtGuard)
  @Delete(':productId')
  removeWishlist(@Req() req, @Param('productId') productId: string) {
    const userId = req.user.id;

    return this.wishlistService.removeWishlist(userId, Number(productId));
  }

  @Delete(':productId')
  remove(@Request() req, @Param('productId') productId: string) {
    return this.wishlistService.remove(req.user.id, Number(productId));
  }
}
