import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: { email: string; password: string }) {
    // Geçici basit login - database bağlantısı olmadan test için
    console.log('Login attempt:', loginDto.email);
    
    // Test kullanıcısı
    if (loginDto.email === 'test@test.com' && loginDto.password === 'test123') {
      return {
        success: true,
        user: {
          id: '1',
          email: 'test@test.com',
          name: 'Test User',
          role: 'STUDENT',
        },
        token: 'test-jwt-token',
      };
    }
    
    return {
      success: false,
      message: 'Invalid credentials',
    };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: { email: string; password: string; name: string }) {
    console.log('Register attempt:', registerDto.email);
    
    return {
      success: true,
      message: 'Registration successful',
      user: {
        id: '1',
        email: registerDto.email,
        name: registerDto.name,
        role: 'STUDENT',
      },
    };
  }
}
