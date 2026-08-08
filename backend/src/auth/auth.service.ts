import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtServiceService } from '../jwt/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtServiceService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { fullName, email, password, phone, role } = registerDto;
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Get Buyer role
    // Get selected role
    const selectedRole = role === 'vendor' ? 'VENDOR' : 'BUYER';

    const userRole = await this.prisma.role.findUnique({
      where: { name: selectedRole },
    });

    if (!userRole) {
      throw new Error(`${selectedRole} role not found`);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        phone,
        roleId: userRole.id,
      },
    });

    return {
      message: 'User registered successfully',
      user,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT
    const token = this.jwtService.generateToken(
      user.id,
      user.email,
      user.role.name,
    );

    return {
      message: 'Login successful',
      access_token: token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        roleId: user.roleId,
      },
    };
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        profileImg: true,
        createdAt: true,

        _count: {
          select: {
            orders: true,
            rfqs: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    const yearsTrading = Math.floor(
      (new Date().getTime() - user.createdAt.getTime()) /
        (1000 * 60 * 60 * 24 * 365),
    );

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      profileImg: user.profileImg,
      createdAt: user.createdAt,

      totalOrders: user._count.orders,
      activeRfqs: user._count.rfqs,
      yearsTrading,
    };
  }

  async updateProfile(userId: number, data: any) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        fullName: data.fullName,
        phone: data.phone,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
      },
    });
  }

  async updateProfilePhoto(userId: number, filename: string) {
    console.log('SERVICE CALLED');
    console.log('User:', userId);
    console.log('Filename:', filename);

    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        profileImg: filename,
      },
      select: {
        id: true,
        profileImg: true,
      },
    });

    console.log('UPDATED USER:', user);

    return user;
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        password: true,
        email: true,
      },
    });

    console.log('USER ID:', userId);
    //New Password of buyer@test.com => NewPassword@123  , for admin => admin@123 , for vendor: vendor@123
    console.log('USER FROM DATABASE:', user);
    console.log('CURRENT PASSWORD:', currentPassword);

    if (!user || !user.password) {
      throw new UnauthorizedException('User password not found');
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    return this.prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        password: hashedPassword,
      },

      select: {
        id: true,
        email: true,
      },
    });
  }
}
