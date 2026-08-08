import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JwtServiceService } from './jwt.service';

@Module({
  imports: [
    NestJwtModule.register({
      secret: 'FAST_MARKETPLACE_SECRET',
      signOptions: {
        expiresIn: '7d',
      },
    }),
  ],
  providers: [JwtServiceService],
  exports: [NestJwtModule, JwtServiceService],
})
export class JwtAuthModule {}