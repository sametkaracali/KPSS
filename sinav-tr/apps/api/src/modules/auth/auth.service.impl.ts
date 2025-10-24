import { 
  Injectable, 
  UnauthorizedException, 
  ConflictException, 
  BadRequestException,
  ForbiddenException,
  Logger,
  InternalServerErrorException
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../../prisma/prisma.service';
import { TokenService } from './services/token.service';
import { PasswordService } from './services/password.service';
import { UserRole } from './types/user.types';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as crypto from 'crypto';

export type UserSession = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  verified: boolean;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number | string;
};

export type AuthResponse = {
  user: UserSession;
  tokens: Tokens;
};

@Injectable()
export class AuthServiceImpl {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly passwordService: PasswordService,
  ) {}

  private readonly logger = new Logger(AuthServiceImpl.name);

  async validateUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        verified: true,
      },
    });
  }

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, password, name, role = UserRole.STUDENT } = registerDto;

    // Validate password strength
    if (!this.passwordService.isPasswordStrong(password)) {
      throw new BadRequestException(
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character',
      );
    }

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    try {
      // Hash password
      const hashedPassword = await this.passwordService.hashPassword(password);

      // Create user in database
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role,
          verified: false, // Email verification required
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          verified: true,
        },
      });

      // Generate tokens
      const tokens = await this.tokenService.generateTokens({
        id: user.id,
        email: user.email,
        role: user.role as UserRole,
      });

      // In a real app, send verification email here
      // await this.mailService.sendVerificationEmail(user.email, verificationToken);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as UserRole,
          verified: user.verified,
        },
        tokens,
      };
    } catch (error) {
      this.logger.error('Registration error', error);
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Email already in use');
        }
      }
      throw new InternalServerErrorException('Registration failed');
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    try {
      // Find user by email
      const user = await this.prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true,
          name: true,
          role: true,
          verified: true,
          bannedUntil: true,
          banReason: true,
        },
      });

      // Check if user exists
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Check if user is banned
      if (user.bannedUntil && user.bannedUntil > new Date()) {
        const message = user.banReason 
          ? `Account is banned until ${user.bannedUntil}. Reason: ${user.banReason}`
          : 'Your account has been suspended. Please contact support.';
        throw new ForbiddenException(message);
      }

      // Verify password
      const isPasswordValid = await this.passwordService.comparePasswords(
        password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate tokens
      const tokens = await this.tokenService.generateTokens({
        id: user.id,
        email: user.email,
        role: user.role as UserRole,
      });

      // Update last login time (non-blocking)
      this.updateLastLogin(user.id).catch(error => {
        this.logger.error('Failed to update last login time:', error);
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as UserRole,
          verified: user.verified,
        },
        tokens,
      };
    } catch (error) {
      this.logger.error('Login error', error);
      if (error instanceof UnauthorizedException || 
          error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException('Login failed');
    }
  }

  private async updateLastLogin(userId: string): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { lastLogin: new Date() },
      });
    } catch (error) {
      this.logger.error(`Failed to update last login for user ${userId}:`, error);
    }
  }
}
