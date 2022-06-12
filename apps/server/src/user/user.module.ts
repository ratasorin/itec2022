import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { SECRET } from '../auth/constant/jwt';
import { DatabaseModule } from '../database/database.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [DatabaseModule],
})
export class UserModule {}
