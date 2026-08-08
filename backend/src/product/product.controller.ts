import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,Param, ParseIntPipe, Patch, Delete
} from '@nestjs/common';

import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';

import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { UpdateProductDto } from './dto/update-product.dto';


@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
  ) {}

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN', 'VENDOR')
  create(
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productService.createProduct(
      createProductDto,
    );
  }

  @Get()
findAll() {
  return this.productService.findAll();
}

@Get(':id')
findOne(
  @Param('id', ParseIntPipe) id: number,
) {
  return this.productService.findOne(id);
}

@Patch(':id')
@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN', 'VENDOR')
update(
  @Param('id', ParseIntPipe) id: number,
  @Body() updateProductDto: UpdateProductDto,
) {
  return this.productService.updateProduct(
    id,
    updateProductDto,
  );
}

@Delete(':id')
@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN', 'VENDOR')
delete(
  @Param('id', ParseIntPipe) id: number,
) {
  return this.productService.deleteProduct(id);
}

@Patch(':id/approve')
@UseGuards(JwtGuard, RolesGuard)
@Roles('Super Admin')
approveProduct(
  @Param('id', ParseIntPipe) id: number,
) {
  return this.productService.approveProduct(id);
}

@Patch(':id/reject')
@UseGuards(JwtGuard, RolesGuard)
@Roles('Super Admin')
rejectProduct(
  @Param('id', ParseIntPipe) id: number,
) {
  return this.productService.rejectProduct(id);
}
}