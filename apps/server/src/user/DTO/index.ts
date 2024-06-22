import { UserDTO as UserDTO_Frontend } from '@shared';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDTO implements UserDTO_Frontend {
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
