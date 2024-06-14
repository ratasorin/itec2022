import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  i_BuildingReviewServerError,
  i_InsertBuildingReviewResponse,
  i_BuildingReviewStats,
} from '@shared';
import { PgError } from '@server/database/utils/interface/pg-error';
import { Pool } from 'pg';

@Injectable()
export class RatingService {
  constructor(@Inject('CONNECTION') private pool: Pool) {}

  async getBuildingRating(building_id: string): Promise<i_BuildingReviewStats> {
    const getBuildingRatingQuery = await this.pool.query<i_BuildingReviewStats>(
      `--sql
        SELECT COUNT(id) AS reviews, AVG(stars)::int AS stars FROM building_ratings WHERE building_id = $1 GROUP BY building_id, deleted HAVING deleted = false;
      `,
      [building_id]
    );

    if (getBuildingRatingQuery.rows.length) {
      return getBuildingRatingQuery.rows[0];
    }

    return { reviews: 0, stars: 0 };
  }

  async addBuildingRating(
    building_id: string,
    reviewer_id: string,
    stars: number
  ): Promise<i_InsertBuildingReviewResponse> {
    try {
      const checkUserHasReviewedBuilding = (
        await this.pool.query(
          `--sql
            SELECT building_ratings.reviewer_id FROM building_ratings WHERE building_id = $1 AND reviewer_id = $2
          `,
          [building_id, reviewer_id]
        )
      ).rows[0];

      if (!checkUserHasReviewedBuilding) {
        const insertBuildingRatingQuery = (
          await this.pool.query(
            `--sql
            INSERT INTO building_ratings(stars, reviewer_id, building_id) VALUES ($1, $2, $3) RETURNING id; 
            `,
            [stars, reviewer_id, building_id]
          )
        ).rows[0];

        const rating_id = insertBuildingRatingQuery.id as string;
        return { rating_id, building_id, stars };
      } else {
        const updateBuildingRatingQuery = (
          await this.pool.query(
            `--sql
            UPDATE building_ratings SET stars = $1 WHERE reviewer_id = $2 AND building_id = $3 RETURNING id;
           `,
            [stars, reviewer_id, building_id]
          )
        ).rows[0];

        const rating_id = updateBuildingRatingQuery.id as string;
        return { rating_id, building_id, stars };
      }
    } catch (e) {
      console.error(e);

      if (e instanceof HttpException) throw e;

      const errorMessage = (e as PgError).detail;
      const error: i_BuildingReviewServerError = { error: errorMessage };

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteBuildingRating(building_rating_id: string) {
    try {
      await this.pool.query(
        `--sql
        DELETE FROM building_ratings WHERE id = $1; 
        `,
        [building_rating_id]
      );
    } catch (e) {
      console.error(e);

      if (e instanceof HttpException) throw e;

      const errorMessage = (e as PgError).detail;
      const error: i_BuildingReviewServerError = { error: errorMessage };

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
