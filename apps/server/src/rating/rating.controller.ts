import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RatingService } from './rating.service';
import {
  i_BuildingReviewStats,
  i_InsertBuildingReviewResponse,
  JwtUser,
} from '@shared';
import { Request } from 'express';

@Controller('rating')
export class RatingController {
  constructor(private ratingService: RatingService) {}

  @Post('/building/:building_id')
  @UseGuards(JwtAuthGuard)
  async addBuildingRating(
    @Param('building_id') building_id: string,
    @Body('stars') stars: number,
    @Req() req: Request
  ): Promise<i_InsertBuildingReviewResponse> {
    const user = req.user as JwtUser;
    return await this.ratingService.addBuildingRating(
      building_id,
      user.id,
      stars
    );
  }

  @Get('/building/:building_id')
  async geti_BuildingReviewStats(
    @Param('building_id') building_id: string
  ): Promise<i_BuildingReviewStats> {
    return await this.ratingService.getBuildingRating(building_id);
  }

  @Post('/building/delete/:building_review_id')
  @UseGuards(JwtAuthGuard)
  async deleteBuildingRating(
    @Param('building_review_id') building_review_id: string
  ) {
    return await this.ratingService.deleteBuildingRating(building_review_id);
  }
}
