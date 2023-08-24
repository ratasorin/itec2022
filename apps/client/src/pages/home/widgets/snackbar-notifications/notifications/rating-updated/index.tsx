import { FC } from 'react';
import { RatingUpdatedPayload } from '../../snackbar.slice';
import Success from './success';
import UnidentifiedError from '../rating-posted/unidentified-error';

const RatingUpdated: FC<RatingUpdatedPayload> = ({ details }) => {
  return details.success ? (
    <Success buildingId={details.buildingId} />
  ) : (
    <UnidentifiedError details={details.error.details} />
  );
};

export default RatingUpdated;
