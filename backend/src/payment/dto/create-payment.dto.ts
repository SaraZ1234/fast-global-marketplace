import { IsInt, IsNumber, IsString } from 'class-validator';


export class CreatePaymentDto {

  @IsInt()
  orderId: number;


  @IsNumber()
  amount: number;


  @IsString()
  method: string;

}