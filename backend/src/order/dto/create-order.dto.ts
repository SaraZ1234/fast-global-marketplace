import { IsInt, IsString } from 'class-validator';

export class CreateOrderDto {

  @IsInt()
  userId: number;

  @IsString()
  paymentMethod: string;

}