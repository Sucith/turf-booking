import { IsNotEmpty, IsEmail, Length } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'username should not be empty' })
  username: string;

  @IsEmail({}, { message: 'email must be a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'password should not be empty' })
  @Length(6, 20, { message: 'password must be between 6 and 20 characters' })
  password: string;

  @IsNotEmpty({ message: 'phone number should not be empty' })
  phnum: string;
}
