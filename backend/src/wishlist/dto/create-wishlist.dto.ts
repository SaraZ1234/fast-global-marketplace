import { IsInt } from 'class-validator';

export class CreateWishlistDto {
  @IsInt()
  userId: number;

  @IsInt()
  productId: number;
}
