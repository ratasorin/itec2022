export type RatingError<E extends { cause: string }, T = {}> = E & T;

export type UnknownRatingError = RatingError<
  { cause: 'MISCELLANEOUS' },
  { details: string }
>;

export const UNIQUE_REVIEWER_CONSTRAINT_FAILED =
  'UNIQUE REVIEWER CONSTRAINT FAILED' as const;

export type RatingConstraintFailedError = RatingError<
  {
    cause: typeof UNIQUE_REVIEWER_CONSTRAINT_FAILED;
  },
  {
    building_id: string;
  }
>;

export type RatingErrorOnInsert =
  | UnknownRatingError
  | RatingConstraintFailedError;

export interface InsertRatingResponse {
  ratingId: string;
  updateId: string;
}
