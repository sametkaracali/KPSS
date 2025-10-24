import { IsString, IsNotEmpty, IsEmail, IsOptional, Length } from 'class-validator';

export class Enable2FADto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class Verify2FADto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  token: string;
}

export class Disable2FADto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  token: string;
}

export class LoginWith2FADto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  @Length(6, 6)
  twoFactorToken?: string;
}
