import { User } from '../../../generated/schema';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDTO implements Omit<User, 'id'> {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsBoolean()
  admin: boolean;
}
