import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RatingService } from './rating.service';
import {
  InsertRatingSuccess,
  JwtUser,
  UndoRatingUpdateSuccess,
  UpdateRatingSuccess,
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
  ): Promise<InsertRatingSuccess> {
    const user = req.user as JwtUser;
    return await this.ratingService.addBuildingRating(
      building_id,
      user.id,
      stars
    );
  }

  @Post('/buildings/:building_id/update')
  @UseGuards(JwtAuthGuard)
  async updateBuildingRating(
    @Param('building_id') building_id: string,
    @Body('stars') stars: number,
    @Req() req: Request
  ): Promise<UpdateRatingSuccess> {
    const user = req.user as JwtUser;
    return await this.ratingService.updateBuildingRating(
      building_id,
      user.id,
      stars
    );
  }

  @Post('buildings/undo/:update_id')
  @UseGuards(JwtAuthGuard)
  async undoBuildingRatingChanges(
    @Param('update_id') update_id: string
  ): Promise<UndoRatingUpdateSuccess> {
    return await this.ratingService.undoLastUpdate(update_id);
  }
}
