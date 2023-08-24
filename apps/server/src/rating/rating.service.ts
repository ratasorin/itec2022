import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  BuildingRatings,
  InsertRatingSuccess,
  RatingConstraintFailedError,
  UndoRatingUpdateSuccess,
  UnknownRatingError,
  UpdateRatingSuccess,
} from '@shared';
import { PG_ERROR_CODES } from 'apps/server/database/utils/errors';
import { PgError } from 'apps/server/database/utils/interface/pg-error';
import { Pool } from 'pg';

@Injectable()
export class RatingService {
  constructor(@Inject('CONNECTION') private pool: Pool) {}

  async getBuildingRating(building_id: string): Promise<BuildingRatings> {
    const getBuildingRatingQuery = await this.pool.query<BuildingRatings>(
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
  ): Promise<InsertRatingSuccess> {
    try {
      const checkRatingIsDeletedQuery = (
        await this.pool.query(
          `--sql
            SELECT deleted FROM building_ratings WHERE building_id = $1 AND reviewer_id = $2
          `,
          [building_id, reviewer_id]
        )
      ).rows[0];

      if (
        // if the user didn't review this building OR
        !checkRatingIsDeletedQuery ||
        // there already is an active review on the building by this user
        checkRatingIsDeletedQuery.deleted === false
      ) {
        // insert a new review
        // in case there is already an active review, this code will trigger the catch block,
        // that will throw a planned error alerting the client about the violation of the unique constraint
        const insertBuildingRatingQuery = (
          await this.pool.query(
            `--sql
            INSERT INTO building_ratings(stars, reviewer_id, building_id) VALUES ($1, $2, $3) RETURNING id; 
          `,
            [stars, reviewer_id, building_id]
          )
        ).rows;
        await this.pool.query(
          `--sql
              INSERT INTO building_rating_updates(stars, reviewer_id, building_id) VALUES ($1, $2, $3);
            `,
          [stars, reviewer_id, building_id]
        );

        const ratingId = insertBuildingRatingQuery[0].id as string;
        return { ratingId, buildingId: building_id };
      }

      // if the review is inactive (aka deleted) do not attempt to insert a new one, because it will trigger a unique constraint error,
      // and tell the client the user has already submitted a review (but the review is "deleted")
      // activate the review and set the new number of stars
      const updateBuildingRatingQuery = (
        await this.pool.query(
          `--sql
              UPDATE building_ratings SET stars = $1, deleted = false WHERE reviewer_id = $2 AND building_id = $3 RETURNING id;
            `,
          [stars, reviewer_id, building_id]
        )
      ).rows;

      await this.pool.query(
        `--sql
              INSERT INTO building_rating_updates(stars, reviewer_id, building_id) VALUES ($1, $2, $3) RETURNING id;
            `,
        [stars, reviewer_id, building_id]
      );

      const ratingId = updateBuildingRatingQuery[0].id as string;
      return { ratingId, buildingId: building_id };
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
  ): Promise<UpdateRatingSuccess> {
    try {
      const { id: ratingId } = (
        await this.pool.query(
          `--sql
            UPDATE building_ratings SET stars = $1 WHERE reviewer_id = $2 AND building_id = $3 RETURNING id;
          `,
          [stars, reviewer_id, building_id]
        )
      ).rows[0];

      await this.pool.query(
        `--sql
          INSERT INTO building_rating_updates (stars, reviewer_id, building_id) VALUES ($1, $2, $3) RETURNING id;
      `,
        [stars, reviewer_id, building_id]
      );

      return { ratingId, buildingId: building_id };
    } catch (e) {
      console.error(e);
      const error: PgError = e;

      throw new HttpException(
        { cause: 'MISCELLANEOUS', details: error.detail } as UnknownRatingError,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async undoLastBuildingReviewUpdate(): Promise<UndoRatingUpdateSuccess> {
    try {
      const previousRating = (
        await this.pool.query(
          `--sql
          SELECT * FROM building_rating_updates
          ORDER BY updated_at DESC 
          LIMIT 1
          OFFSET 1;
        `
        )
      ).rows[0];
      if (!previousRating) {
        const currentRating = (
          await this.pool.query(
            `--sql 
          DELETE FROM building_rating_updates WHERE id = (SELECT id FROM building_rating_updates ORDER BY updated_at DESC LIMIT 1) RETURNING reviewer_id, building_id        
        `
          )
        ).rows[0];
        if (!currentRating)
          throw new HttpException(
            {
              cause: 'MISCELLANEOUS',
              details: 'UNDO STACK EMPTY!',
            } as UnknownRatingError,
            HttpStatus.INTERNAL_SERVER_ERROR
          );

        const { stars } = (
          await this.pool.query(
            `--sql
          UPDATE building_ratings SET deleted = true WHERE reviewer_id = $1 AND building_id = $2 RETURNING stars;
        `,
            [currentRating.reviewer_id, currentRating.building_id]
          )
        ).rows[0];

        return {
          afterUndo: { deleted: true, stars },
          beforeUndo: { deleted: false, stars },
          nextUndo: { deleted: null, stars: null },
          buildingId: currentRating.building_id,
        };
      }

      const { reviewer_id, building_id, deleted, stars } = previousRating;

      const nextUndoState = (
        await this.pool.query(
          `--sql
          SELECT * FROM building_rating_updates
          ORDER BY updated_at DESC 
          LIMIT 1
          OFFSET 2;
        `
        )
      ).rows[0];

      const beforeUndoState = (
        await this.pool.query(
          `--sql
          SELECT deleted, stars FROM building_ratings WHERE reviewer_id = $1 AND building_id = $2
      `,
          [reviewer_id, building_id]
        )
      ).rows[0];

      if (!nextUndoState)
        return {
          afterUndo: { deleted, stars },
          beforeUndo: {
            deleted: beforeUndoState.deleted,
            stars: beforeUndoState.stars,
          },
          buildingId: building_id,
          nextUndo: { deleted: null, stars: null },
        };

      this.pool.query(
        `--sql
        DELETE FROM building_rating_updates WHERE id = (SELECT id FROM building_rating_updates ORDER BY updated_at DESC LIMIT 1)
      `
      );

      this.pool.query(
        `--sql
        UPDATE building_ratings SET deleted = $1, stars = $2 WHERE reviewer_id = $3 AND building_id = $4 RETURNING deleted, stars;
      `,
        [deleted, stars, reviewer_id, building_id]
      );

      return {
        beforeUndo: {
          deleted: beforeUndoState.deleted,
          stars: beforeUndoState.stars,
        },
        afterUndo: { deleted, stars },
        nextUndo: {
          deleted: nextUndoState.deleted,
          stars: nextUndoState.stars,
        },
        buildingId: building_id,
      };
    } catch (e) {
      console.error(e);

      if (e instanceof HttpException) {
        throw e;
      }

      const error: PgError = e;

      throw new HttpException(
        { cause: 'MISCELLANEOUS', details: error.detail } as UnknownRatingError,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
