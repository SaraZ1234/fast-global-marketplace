import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsInt,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number;

  @IsInt()
  stock: number;

  @IsInt()
  vendorId: number;

  @IsInt()
  categoryId: number;

  @IsInt()
  subCategoryId: number;
}