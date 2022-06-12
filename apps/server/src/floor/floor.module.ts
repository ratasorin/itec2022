import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { FloorController } from './floor.controller';
import { FloorService } from './floor.service';

@Module({
  controllers: [FloorController],
  providers: [FloorService],
  imports: [DatabaseModule],
})
export class FloorModule {}
