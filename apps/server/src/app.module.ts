import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { BookingService } from './booking/booking.service';
import { BookingModule } from './booking/booking.module';
import { AuthModule } from './auth/auth.module';
import { Controller } from './.controller';

@Module({
  imports: [PrismaModule, UserModule, UserModule, BookingModule, AuthModule],
  controllers: [AppController, Controller],
  providers: [AppService, PrismaService, UserService, BookingService],
})
export class AppModule {}
