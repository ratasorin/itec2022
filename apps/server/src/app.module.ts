import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { BookingService } from './booking/booking.service';
import { BookingModule } from './booking/booking.module';
import { AuthModule } from './auth/auth.module';
import { BuildingModule } from './building/building.module';
import { FloorService } from './floor/floor.service';
import { FloorModule } from './floor/floor.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { RatingModule } from './rating/rating.module';
import { join } from 'path';

@Module({
  imports: [
    UserModule,
    UserModule,
    BookingModule,
    AuthModule,
    BuildingModule,
    FloorModule,
    DatabaseModule,
    RatingModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '.env'),
    }),
    MailModule,
  ],
  providers: [UserService, BookingService, FloorService],
})
export class AppModule {}
