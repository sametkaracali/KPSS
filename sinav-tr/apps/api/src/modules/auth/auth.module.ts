import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthServiceImpl } from './auth.service.impl';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from '../../prisma/prisma.module';
import jwtConfig from './config/jwt.config';
import { TokenService } from './services/token.service';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfig)],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: config.get<string>('jwt.expiresIn'),
          issuer: config.get<string>('jwt.issuer'),
          audience: config.get<string>('jwt.audience'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthServiceImpl,
    JwtStrategy,
    TokenService,
    {
      provide: 'REFRESH_JWT_SERVICE',
      useFactory: (config: ConfigService) => ({
        sign: (payload: any) => {
          const jwtService = new JwtService({
            secret: config.get<string>('jwt.refreshSecret'),
            signOptions: {
              expiresIn: config.get<string>('jwt.refreshExpiresIn'),
              issuer: config.get<string>('jwt.issuer'),
              audience: config.get<string>('jwt.audience'),
            },
          });
          return jwtService.sign(payload);
        },
      }),
      inject: [ConfigService],
    },
  ],
  exports: [AuthService, AuthServiceImpl, TokenService],
})
export class AuthModule {}
