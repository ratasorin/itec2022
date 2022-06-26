import { User as PGUser } from '../../../generated/schema';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDTO implements Omit<PGUser, 'id'> {
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
