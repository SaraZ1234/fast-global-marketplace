import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CheckoutOrderDto } from './dto/checkout-order.dto';
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() data: CreateOrderDto) {
    return this.orderService.createOrder(data);
  }

  @Get()
  getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-orders')
  getMyOrders(@Req() req) {
    console.log('MY ORDERS USER:', req.user);
    return this.orderService.getOrdersByUser(req.user.id);
  }

  @Get('/vendor/:vendorId')
  getVendorOrders(@Param('vendorId') vendorId: string) {
    return this.orderService.getVendorOrders(Number(vendorId));
  }

  @Get(':id')
  getOrderById(@Param('id') id: string) {
    console.log('GET ORDER BY ID:', id);
    return this.orderService.getOrderById(Number(id));
  }

  // @Get('/user/:userId')
  // getOrdersByUser(@Param('userId') userId: string) {
  //   return this.orderService.getOrdersByUser(Number(userId));
  // }

  @UseGuards(JwtAuthGuard)
  @Get('vendor-orders')
  getMyVendorOrders(@Req() req) {
    return this.orderService.getVendorOrdersByUser(req.user.id);
  }

  @Patch(':id/status')
  updateOrderStatus(
    @Param('id') id: string,
    @Body() body: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateOrderStatus(Number(id), body.status);
  }

  @Patch(':id/cancel')
  cancelOrder(@Param('id') id: string) {
    return this.orderService.cancelOrder(Number(id));
  }

  @Post('checkout')
  checkout(@Body() data: CheckoutOrderDto) {
    return this.orderService.createOrder(data);
  }
}
