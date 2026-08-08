import {
  IsString,
  IsInt,
  IsOptional,
  IsNumber,
} from "class-validator";

export class CreateRfqDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsInt()
  quantity: number;

  @IsOptional()
  @IsNumber()
  budget?: number;
}