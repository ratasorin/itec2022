import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  BuildingRatings,
  InsertRatingSuccess,
  RatingConstraintFailedError,
  UndoRatingUpdateSuccess,
  UnknownRatingError,
  UpdateRatingSuccess,
} from '@shared';
import { PG_ERROR_CODES } from '@server/database/utils/errors';
import { PgError } from '@server/database/utils/interface/pg-error';
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
            INSERT INTO building_rating_updates(reviewer_id, building_id, deleted) VALUES ($1, $2, true);
          `,
          [reviewer_id, building_id]
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
          INSERT INTO building_rating_updates(reviewer_id, building_id, deleted) VALUES ($1, $2, true) RETURNING id;
        `,
        [reviewer_id, building_id]
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
      const currentRatingState = (
        await this.pool.query(
          `--sql 
        SELECT stars, deleted FROM building_ratings WHERE building_id = $1 AND reviewer_id = $2;
      `,
          [building_id, reviewer_id]
        )
      ).rows[0];

      if (!currentRatingState)
        throw new HttpException(
          {
            cause: 'MISCELLANEOUS',
            details: 'You cannot update a non-existing record!',
          } as UnknownRatingError,
          HttpStatus.INTERNAL_SERVER_ERROR
        );

      await this.pool.query(
        `--sql
          INSERT INTO building_rating_updates (stars, deleted, reviewer_id, building_id) VALUES ($1, $2, $3, $4);
      `,
        [
          currentRatingState.stars,
          currentRatingState.deleted,
          reviewer_id,
          building_id,
        ]
      );

      const { id: ratingId } = (
        await this.pool.query(
          `--sql
            UPDATE building_ratings SET stars = $1 WHERE reviewer_id = $2 AND building_id = $3 RETURNING id;
          `,
          [stars, reviewer_id, building_id]
        )
      ).rows[0];

      return { ratingId, buildingId: building_id };
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) throw e;
      const error: PgError = e;

      throw new HttpException(
        { cause: 'MISCELLANEOUS', details: error.detail } as UnknownRatingError,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async undoLastBuildingReviewUpdate(): Promise<UndoRatingUpdateSuccess> {
    try {
      const ratingAfterUndo = (
        await this.pool.query(
          `--sql
          SELECT * FROM building_rating_updates
          ORDER BY updated_at DESC 
          LIMIT 1;
        `
        )
      ).rows[0];

      if (!ratingAfterUndo) {
        throw new HttpException(
          {
            cause: 'MISCELLANEOUS',
            details: 'UNDO STACK EMPTY!',
          } as UnknownRatingError,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      // remove the last update
      await this.pool.query(
        `--sql
        DELETE FROM building_rating_updates WHERE id = (SELECT id FROM building_rating_updates ORDER BY updated_at DESC LIMIT 1)
      `
      );

      const ratingBeforeUndo = (
        await this.pool.query(
          `--sql
          SELECT deleted, stars FROM building_ratings WHERE building_id = $1 AND reviewer_id = $2;
        `,
          [ratingAfterUndo.building_id, ratingAfterUndo.reviewer_id]
        )
      ).rows[0];

      // update the state
      await this.pool.query(
        `--sql
        UPDATE building_ratings SET deleted = $1, stars = $2 WHERE reviewer_id = $3 AND building_id = $4;
      `,
        [
          ratingAfterUndo.deleted,
          ratingAfterUndo.stars,
          ratingAfterUndo.reviewer_id,
          ratingAfterUndo.building_id,
        ]
      );

      // do not use any offset because we already deleted the undo state before it, so this is the undo state that follows
      const nextUndoState = (
        await this.pool.query(
          `--sql
          SELECT * FROM building_rating_updates
          ORDER BY updated_at DESC 
          LIMIT 1;
        `
        )
      ).rows[0];

      if (!nextUndoState) {
        return {
          afterUndo: {
            deleted: ratingAfterUndo.deleted,
            stars: ratingAfterUndo.stars,
          },
          beforeUndo: {
            deleted: ratingBeforeUndo.deleted,
            stars: ratingBeforeUndo.stars,
          },
          buildingId: ratingAfterUndo.building_id,
          nextUndo: { deleted: null, stars: null },
        };
      }

      return {
        beforeUndo: {
          deleted: ratingBeforeUndo.deleted,
          stars: ratingBeforeUndo.stars,
        },
        afterUndo: {
          deleted: ratingAfterUndo.deleted,
          stars: ratingAfterUndo.stars,
        },
        nextUndo: {
          deleted: nextUndoState.deleted,
          stars: nextUndoState.stars,
        },
        buildingId: ratingAfterUndo.building_id,
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

  async cleanBuildingUpdates(building_id: string, user_id: string) {
    await this.pool.query(
      `--sql 
      DELETE FROM building_rating_updates WHERE reviewer_id = $1 AND building_id = $2
    `,
      [user_id, building_id]
    );
  }

  async deleteBuildingRating(building_id: string, reviewer_id: string) {
    try {
      const currentRatingState = (
        await this.pool.query(
          `--sql 
        SELECT stars, deleted FROM building_ratings WHERE building_id = $1 AND reviewer_id = $2;
      `,
          [building_id, reviewer_id]
        )
      ).rows[0];

      if (!currentRatingState)
        throw new HttpException(
          {
            cause: 'MISCELLANEOUS',
            details: `You cannot delete a non-existing record!`,
          } as UnknownRatingError,
          HttpStatus.INTERNAL_SERVER_ERROR
        );

      await this.pool.query(
        `--sql
          INSERT INTO building_rating_updates (stars, deleted, reviewer_id, building_id) VALUES ($1, $2, $3, $4);
      `,
        [
          currentRatingState.stars,
          currentRatingState.deleted,
          reviewer_id,
          building_id,
        ]
      );

      await this.pool.query(
        `--sql
      UPDATE building_ratings SET deleted = true WHERE reviewer_id = $1 AND building_id = $2;
    `,
        [reviewer_id, building_id]
      );
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) throw e;
      const error: PgError = e;

      throw new HttpException(
        {
          cause: 'MISCELLANEOUS',
          details: error.detail,
        } as UnknownRatingError,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
