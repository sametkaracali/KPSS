import { Request } from 'express';
import { UserRole } from '../types/user.types';

export enum TokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  type: TokenType;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string | string[];
}

export interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}
