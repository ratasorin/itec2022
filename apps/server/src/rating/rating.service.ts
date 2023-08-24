import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  RatingConstraintFailedError,
  UndoRatingUpdateSuccess,
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
      return { ratingId, updateId };
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
      const { id: ratingId } = (
        await this.pool.query(
          `--sql
            UPDATE building_ratings SET stars = $1 WHERE reviewer_id = $2 AND building_id = $3 RETURNING id;
          `,
          [stars, reviewer_id, building_id]
        )
      ).rows[0];

      const { id: updateId } = (
        await this.pool.query(
          `--sql
          INSERT INTO building_rating_updates (stars, reviewer_id, building_id) VALUES ($1, $2, $3) RETURNING id;
      `,
          [stars, reviewer_id, building_id]
        )
      ).rows[0];

      return { ratingId, updateId };
    } catch (e) {
      console.error(e);
      const error: PgError = e;

      throw new HttpException(
        { cause: 'MISCELLANEOUS', details: error.detail } as UnknownRatingError,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async undoLastUpdate(update_id: string): Promise<UndoRatingUpdateSuccess> {
    try {
      const previousRating = (
        await this.pool.query(
          `--sql
          SELECT * FROM building_rating_updates WHERE id = $1 
          ORDER BY updated_at DESC 
          LIMIT 1
          OFFSET 1;
        `,
          [update_id]
        )
      ).rows[0];
      if (!previousRating) {
        const { reviewer_id, building_id } = (
          await this.pool.query(
            `--sql 
          DELETE FROM building_rating_updates WHERE id = $1 RETURNING reviewer_id, building_id        
        `,
            [update_id]
          )
        ).rows[0];

        const { deleted, stars } = (
          await this.pool.query(
            `--sql
          UPDATE building_ratings SET deleted = true WHERE reviewer_id = $1 AND building_id = $2 RETURNING deleted, stars;
        `,
            [reviewer_id, building_id]
          )
        ).rows[0];

        return {
          afterUndo: { deleted: true, stars },
          beforeUndo: { deleted: false, stars },
          nextUndo: { deleted: null, stars: null },
          updateId: null,
        };
      }

      const { id, reviewer_id, building_id, deleted, stars } = previousRating;

      const { deleted: nextUndoDeleted, stars: nextUndoStars } = (
        await this.pool.query(
          `--sql
          SELECT * FROM building_rating_updates WHERE id = $1 
          ORDER BY updated_at DESC 
          LIMIT 1
          OFFSET 2;
        `,
          [update_id]
        )
      ).rows[0];

      const { deleted: deletedBeforeUndo, stars: starsBeforeUndo } = (
        await this.pool.query(
          `--sql
          SELECT deleted, stars FROM building_ratings WHERE reviewer_id = $1 AND building_id = $2
      `,
          [reviewer_id, building_id]
        )
      ).rows[0];

      this.pool.query(
        `--sql
        DELETE FROM building_rating_updates WHERE id = $1;
      `,
        [update_id]
      );

      this.pool.query(
        `--sql
        UPDATE building_ratings SET deleted = $1, stars = $2 WHERE reviewer_id = $3 AND building_id = $4 RETURNING deleted, stars;
      `,
        [deleted, stars, reviewer_id, building_id]
      );

      return {
        beforeUndo: {
          deleted: deletedBeforeUndo,
          stars: starsBeforeUndo,
        },
        afterUndo: { deleted, stars },
        nextUndo: { deleted: nextUndoDeleted, stars: nextUndoStars },
        updateId: id,
      };
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
