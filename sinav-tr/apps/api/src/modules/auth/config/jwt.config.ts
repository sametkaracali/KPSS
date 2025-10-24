import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '15m', // Access token expires in 15 minutes
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d', // Refresh token expires in 7 days
  issuer: process.env.JWT_ISSUER || 'sinavtr-api',
  audience: process.env.JWT_AUDIENCE || 'sinavtr-app',
}));
