import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtPayload, TokenType } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
          if (!token) {
            const cookie = request.cookies?.['access_token'];
            return cookie || null;
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
      issuer: configService.get<string>('jwt.issuer'),
      audience: configService.get<string>('jwt.audience'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    if (payload.type !== TokenType.ACCESS) {
      throw new UnauthorizedException('Invalid token type');
    }

    // Add token to request for further use if needed
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    return req.user;
  }
}
