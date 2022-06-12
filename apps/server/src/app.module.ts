import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { BookingService } from './booking/booking.service';
import { BookingModule } from './booking/booking.module';
import { AuthModule } from './auth/auth.module';
import { BuildingModule } from './building/building.module';
import { FloorService } from './floor/floor.service';
import { FloorModule } from './floor/floor.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    UserModule,
    UserModule,
    BookingModule,
    AuthModule,
    BuildingModule,
    FloorModule,
    DatabaseModule,
  ],
  providers: [AppService, UserService, BookingService, FloorService],
})
export class AppModule {}
