import { IsInt, IsString } from 'class-validator';

export class CheckoutOrderDto {

  @IsInt()
  userId: number;


  @IsString()
  paymentMethod: string;

}