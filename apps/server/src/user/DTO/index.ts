import { UserDB } from '@shared';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDTO implements Omit<UserDB, 'id' | 'admin'> {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
