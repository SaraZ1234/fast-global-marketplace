import { Body, Controller, Post, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UseGuards, Request, Get } from '@nestjs/common';
import { JwtGuard } from './jwt/jwt.guard';
import { Roles } from './roles/roles.decorator';
import { RolesGuard } from './roles/roles.guard';
import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  //   @Get('profile')
  // @UseGuards(JwtGuard)
  // getProfile(@Request() req) {
  //   return {
  //     message: 'Protected Route',
  //     user: req.user,
  //   };
  // }

  @Get('profile')
  @UseGuards(JwtGuard)
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }

  @Patch('profile')
  @UseGuards(JwtGuard)
  async updateProfile(@Request() req, @Body() body: any) {
    return this.authService.updateProfile(req.user.id, body);
  }

  @Post('profile/photo')
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads',
    }),
  )
  async updateProfilePhoto(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('CONTROLLER CALLED');
    console.log('USER:', req.user);
    console.log('FILE:', file);

    return this.authService.updateProfilePhoto(req.user.id, file.filename);
  }

  @Patch('change-password')
  @UseGuards(JwtGuard)
  async changePassword(@Request() req, @Body() body: ChangePasswordDto) {
    console.log('JWT USER:', req.user);
    console.log('BODY:', body);

    return this.authService.changePassword(
      req.user.id,
      body.currentPassword,
      body.newPassword,
    );
  }

  @Get('admin')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('Super Admin')
  adminOnly(@Request() req) {
    return {
      message: 'Welcome Super Admin!',
      user: req.user,
    };
  }
}
