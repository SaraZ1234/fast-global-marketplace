import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtServiceService {
  constructor(private jwtService: JwtService) {}

  generateToken(userId: number, email: string, role: string) {
  return this.jwtService.sign({
    sub: userId,
    email,
    role,
  });
}
}