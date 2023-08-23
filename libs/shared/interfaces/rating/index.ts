export type ErrorRating =
  | {
      cause: 'UNIQUE REVIEWER CONSTRAINT FAILED';
    }
  | { cause: 'MISCELLANEOUS'; details: string };
