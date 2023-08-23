import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';

@Module({
  controllers: [RatingController],
  imports: [DatabaseModule],
  providers: [RatingService],
})
export class RatingModule {}
