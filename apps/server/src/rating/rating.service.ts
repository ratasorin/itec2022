import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  InsertRatingResponse,
  RatingConstraintFailedError,
  UnknownRatingError,
} from '@shared';
import { PG_ERROR_CODES } from 'apps/server/database/utils/errors';
import { PgError } from 'apps/server/database/utils/interface/pg-error';
import { Pool } from 'pg';

@Injectable()
export class RatingService {
  constructor(@Inject('CONNECTION') private pool: Pool) {}

  async addBuildingRating(
    building_id: string,
    reviewer_id: string,
    stars: number
  ) {
    try {
      const insertBuildingRatingQuery = await this.pool.query(
        `--sql
      INSERT INTO building_ratings(stars, reviewer_id, building_id) VALUES ($1, $2, $3) RETURNING id; 
      `,
        [stars, reviewer_id, building_id]
      );

      const insertBuildingRatingUpdateQuery = await this.pool.query(
        `--sql
        INSERT INTO building_rating_updates(stars, reviewer_id, building_id) VALUES ($1, $2, $3) RETURNING id;
      `,
        [stars, reviewer_id, building_id]
      );

      const ratingId = insertBuildingRatingQuery.rows[0].id as string;
      const updateId = insertBuildingRatingUpdateQuery.rows[0].id as string;
      return { ratingId, updateId } as InsertRatingResponse;
    } catch (e) {
      console.error(e);
      const error: PgError = e;

      if (error.code === PG_ERROR_CODES.UNIQUE_VIOLATION)
        throw new HttpException(
          {
            cause: 'UNIQUE REVIEWER CONSTRAINT FAILED',
            building_id,
          } as RatingConstraintFailedError,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      else
        throw new HttpException(
          {
            cause: 'MISCELLANEOUS',
            details: error.detail,
          } as UnknownRatingError,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }

  async updateBuildingRating(
    building_id: string,
    reviewer_id: string,
    stars: number
  ) {
    try {
      const updateBuildingRatingQuery = await this.pool.query(
        `--sql
      UPDATE building_ratings SET stars = $1 WHERE reviewer_id = $2 AND building_id = $3 RETURNING id;
      `,
        [stars, reviewer_id, building_id]
      );
      const reviewId = updateBuildingRatingQuery.rows[0].id as string;
      return { reviewId };
    } catch (e) {
      console.error(e);
      const error: PgError = e;

      throw new HttpException(
        { cause: 'MISCELLANEOUS', details: error.detail } as UnknownRatingError,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
