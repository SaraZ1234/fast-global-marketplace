import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Get,Param
} from '@nestjs/common';
import { QuotationService } from './quotation.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('quotation')
export class QuotationController {
  constructor(private readonly quotationService: QuotationService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() dto: CreateQuotationDto) {
    console.log('REQ.USER =', req.user);

    return this.quotationService.create(req.user.id, dto);
  }

  @Get('rfqs')
  findAllRfqs() {
    return this.quotationService.findAllRfqs();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  findMyQuotations(@Request() req) {
    return this.quotationService.findMyQuotations(req.user.id);
  }

  @Get('rfq/:rfqId')
  findByRfq(@Param('rfqId') rfqId: string) {
    return this.quotationService.findByRfq(+rfqId);
  }
}
