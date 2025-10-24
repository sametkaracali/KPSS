import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, TokenType } from '../interfaces/jwt-payload.interface';
import { UserRole } from '../types/user.types';

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string | number;
}

interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
  issuer: string;
  audience: string;
}

@Injectable()
export class TokenService {
  private readonly config: JwtConfig;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.config = {
      secret: this.configService.get<string>('jwt.secret') || 'default-secret',
      expiresIn: this.configService.get<string>('jwt.expiresIn') || '15m',
      refreshSecret: this.configService.get<string>('jwt.refreshSecret') || 'default-refresh-secret',
      refreshExpiresIn: this.configService.get<string>('jwt.refreshExpiresIn') || '7d',
      issuer: this.configService.get<string>('jwt.issuer') || 'sinavtr-api',
      audience: this.configService.get<string>('jwt.audience') || 'sinavtr-app',
    };
  }

  async generateTokens(user: { id: string; email: string; role: UserRole }): Promise<TokenResponse> {
    const accessTokenPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: TokenType.ACCESS,
    };

    const refreshTokenPayload: JwtPayload = {
      ...accessTokenPayload,
      type: TokenType.REFRESH,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessTokenPayload, {
        secret: this.config.secret,
        expiresIn: this.config.expiresIn,
        issuer: this.config.issuer,
        audience: this.config.audience,
      }),
      this.jwtService.signAsync(refreshTokenPayload, {
        secret: this.config.refreshSecret,
        expiresIn: this.config.refreshExpiresIn,
        issuer: this.config.issuer,
        audience: this.config.audience,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.config.expiresIn,
    };
  }

  async verifyToken(token: string, isRefreshToken = false): Promise<JwtPayload> {
    try {
      const secret = isRefreshToken ? this.config.refreshSecret : this.config.secret;
      
      return await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret,
        issuer: this.config.issuer,
        audience: this.config.audience,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async refreshTokens(refreshToken: string): Promise<TokenResponse> {
    try {
      const payload = await this.verifyToken(refreshToken, true);
      
      if (payload.type !== TokenType.REFRESH) {
        throw new UnauthorizedException('Invalid token type');
      }

      return this.generateTokens({
        id: payload.sub,
        email: payload.email,
        role: payload.role as UserRole,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
