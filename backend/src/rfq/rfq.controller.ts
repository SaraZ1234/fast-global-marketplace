import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { RfqService } from './rfq.service';
import { CreateRfqDto } from './dto/create-rfq.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Patch, Param, ParseIntPipe } from '@nestjs/common';
import { UpdateRfqDto } from './dto/update-rfq.dto';
import { Delete } from '@nestjs/common';

@Controller('rfq')
export class RfqController {
  constructor(private readonly rfqService: RfqService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() dto: CreateRfqDto) {
    return this.rfqService.create(req.user.id, dto);
  }

  @Get()
  findAll() {
    return this.rfqService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMy(@Request() req) {
    return this.rfqService.findMy(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRfqDto) {
    return this.rfqService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rfqService.remove(id);
  }
}
