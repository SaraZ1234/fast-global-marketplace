import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { VendorService } from './vendor.service';

@Controller('public/vendors')
export class PublicVendorController {
  constructor(
    private readonly vendorService: VendorService,
  ) {}

  @Get()
  findPublicVendors() {
    return this.vendorService.findPublicVendors();
  }

  @Get(':id')
  findPublicVendor(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.vendorService.findPublicVendor(id);
  }
}