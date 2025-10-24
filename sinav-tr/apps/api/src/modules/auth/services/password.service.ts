import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class PasswordService {
  private readonly SALT_ROUNDS = 12;

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async comparePasswords(plainText: string, hashed: string): Promise<boolean> {
    if (!plainText || !hashed) {
      return false;
    }
    return bcrypt.compare(plainText, hashed);
  }

  generateRandomPassword(length = 16): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]\\:;?><,./-=';
    let password = '';
    const values = new Uint32Array(length);
    
    crypto.getRandomValues(values);
    
    for (let i = 0; i < length; i++) {
      password += charset[values[i] % charset.length];
    }
    
    return password;
  }

  isPasswordStrong(password: string): boolean {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+~`|}{[\]\\:;?><,./\-='"])[A-Za-z\d!@#$%^&*()_+~`|}{[\]\\:;?><,./\-='"]{8,}$/;
    return strongPasswordRegex.test(password);
  }
}
