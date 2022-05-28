import { User as PrismaUser } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class User implements PrismaUser {
  admin: boolean;
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;
}
