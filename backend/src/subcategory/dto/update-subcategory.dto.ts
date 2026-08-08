import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateSubCategoryDto {

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  categoryId?: number;

}