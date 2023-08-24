import { FC } from 'react';
import { RatingUpdatedPayload } from '../../snackbar.slice';
import Success from './success';
import UnidentifiedError from '../rating-posted/unidentified-error';

const RatingUpdated: FC<RatingUpdatedPayload> = ({ details }) => {
  return (
    <>
      {details.success ? (
        <Success updateId={details.updateId} />
      ) : (
        <UnidentifiedError details={details.error.details} />
      )}
    </>
  );
};

export default RatingUpdated;
