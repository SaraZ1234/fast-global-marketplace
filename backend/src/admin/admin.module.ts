import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports:[
    PrismaModule,
    PassportModule
  ],
  controllers:[
    AdminController
  ],
  providers:[
    AdminService
  ]
})
export class AdminModule {}