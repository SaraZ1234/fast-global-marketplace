import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Get,
  Delete,
  Patch,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(':userId/add')
  addToCart(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() data: AddToCartDto,
  ) {
    return this.cartService.addToCart(userId, data);
  }

  @Get(':userId')
  getCart(@Param('userId', ParseIntPipe) userId: number) {
    return this.cartService.getCart(userId);
  }

  @Delete('item/:id')
  removeCartItem(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.removeCartItem(id);
  }

  @Delete(':userId/clear')
  clearCart(@Param('userId', ParseIntPipe) userId: number) {
    return this.cartService.clearCart(userId);
  }

  @Patch('item/:id')
  updateCartItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(id, data);
  }
}
