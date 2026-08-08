import { Module } from '@nestjs/common';
import { VendorController } from './vendor.controller';
import {PublicVendorController} from './public-vendor.controller'
import { VendorService } from './vendor.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VendorController,PublicVendorController],
  providers: [VendorService],
})
export class VendorModule {}