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

export interface InsertRatingSuccess {
  ratingId: string;
  updateId: string;
}

export type UpdateRatingSuccess = InsertRatingSuccess;

export interface UndoRatingUpdateSuccess {
  beforeUndo: {
    deleted: boolean;
    stars: number;
  };
  afterUndo: {
    deleted: boolean;
    stars: number;
  };
  nextUndo: {
    deleted: boolean | null;
    stars: number | null;
  };
  updateId: string | null;
}
