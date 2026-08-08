import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateQuotationDto {
  @IsInt()
  rfqId: number;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  message?: string;
}