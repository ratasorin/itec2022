import { Module } from '@nestjs/common';
import { BuildingService } from './building.service';
import { BuildingController } from './building.controller';
import { DatabaseModule } from '../database/database.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';

@Module({
  imports: [DatabaseModule, PassportModule],
  providers: [BuildingService, JwtStrategy],
  controllers: [BuildingController],
})
export class BuildingModule {}
