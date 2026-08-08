import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from '../auth/roles/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  // Get all users
  @Get('users')
  @Roles('ADMIN')
  getAllUsers() {
    console.log('ADMIN USERS ROUTE HIT');

    return this.adminService.getAllUsers();
  }

  // Update user status
  @Patch('user/:id/status')
  updateUserStatus(@Param('id') id: string, @Body() body: { status: boolean }) {
    return this.adminService.updateUserStatus(Number(id), body.status);
  }

  // Get pending vendors
  @Get('vendors/pending')
  getPendingVendors() {
    return this.adminService.getPendingVendors();
  }

  // Approve vendor
  @Patch('vendor/:id/approve')
  approveVendor(@Param('id') id: string) {
    return this.adminService.approveVendor(Number(id));
  }

  // Get pending products
  @Get('products/pending')
  getPendingProducts() {
    return this.adminService.getPendingProducts();
  }

  // Get all products
  @Get('products')
  getAllProducts() {
    return this.adminService.getAllProducts();
  }

  // Approve product
  @Patch('product/:id/approve')
  approveProduct(@Param('id') id: string) {
    return this.adminService.approveProduct(Number(id));
  }

  @Patch('vendor/:id/reject')
  rejectVendor(@Param('id') id: string) {
    return this.adminService.rejectVendor(Number(id));
  }

  @Patch('product/:id/reject')
  rejectProduct(@Param('id') id: string) {
    return this.adminService.rejectProduct(Number(id));
  }

  // Get all orders
  @Get('orders')
  getAllOrders() {
    return this.adminService.getAllOrders();
  }

  // Update order status
  @Patch('order/:id/status')
  updateOrderStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.adminService.updateOrderStatus(Number(id), body.status);
  }

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboard();
  }

  // Get all payments
  @Get('payments')
  getAllPayments() {
    return this.adminService.getAllPayments();
  }

  // Update payment status
  @Patch('payment/:id/status')
  updatePaymentStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.adminService.updatePaymentStatus(Number(id), body.status);
  }

  @Get('vendors')
  getAllVendors() {
    return this.adminService.getAllVendors();
  }
}
