import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RatingService } from './rating.service';
import { JwtUser } from '@shared';
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
  ) {
    const user = req.user as JwtUser;
    return await this.ratingService.addBuildingRating(
      building_id,
      user.id,
      stars
    );
  }
}
