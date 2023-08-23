import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Error, ErrorRating } from '@shared';
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
      const reviewId = insertBuildingRatingQuery.rows[0].id as string;
      return reviewId;
    } catch (e) {
      console.error(e);
      const error: PgError = e;

      if (error.code === PG_ERROR_CODES.UNIQUE_VIOLATION)
        throw new HttpException(
          { cause: 'UNIQUE REVIEWER CONSTRAINT FAILED' } as ErrorRating,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      else
        throw new HttpException(
          { cause: 'MISCELLANEOUS', details: error.detail } as ErrorRating,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }
}
