import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';

export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
}

export class RegisterDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
