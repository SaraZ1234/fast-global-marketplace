import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  Req,
} from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

import { UseGuards } from '@nestjs/common';

import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';

@Controller('vendors')
@UseGuards(JwtGuard, RolesGuard)
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  // Super Admin creates vendor

  @Post()
  @Roles('Super Admin')
  create(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorService.createVendor(createVendorDto);
  }

  // Super Admin + Vendor Admin can view vendors
  @Get()
  @Roles('Super Admin', 'Vendor Admin')
  findAll() {
    return this.vendorService.findAll();
  }

  // Super Admin + Vendor Admin can update
  @Patch(':id')
  @Roles('Super Admin', 'Vendor Admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVendorDto: UpdateVendorDto,
  ) {
    return this.vendorService.updateVendor(id, updateVendorDto);
  }

  // Only Super Admin can delete
  @Delete(':id')
  @Roles('Super Admin')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.vendorService.deleteVendor(id);
  }

  // Only Super Admin can approve
  @Patch(':id/approve')
  @Roles('Super Admin')
  approveVendor(@Param('id', ParseIntPipe) id: number) {
    return this.vendorService.approveVendor(id);
  }

  // Only Super Admin can reject
  @Patch(':id/reject')
  @Roles('Super Admin')
  rejectVendor(@Param('id', ParseIntPipe) id: number) {
    return this.vendorService.rejectVendor(id);
  }

  //public-endpoint
  @Get('my-profile')
  @Roles('VENDOR')
  getMyProfile(@Req() req) {
    return this.vendorService.findByUser(req.user.id);
  }

  // Super Admin + Vendor Admin can view vendor

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vendorService.findOne(id);
  }
}
