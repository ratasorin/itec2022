import { User as PGUser } from '../../../generated/schema';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UserDTO implements Omit<PGUser, 'id'> {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsBoolean()
  admin: boolean;
}
