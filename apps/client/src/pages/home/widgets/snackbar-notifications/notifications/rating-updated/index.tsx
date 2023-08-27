import { FC } from 'react';
import { RatingUpdatedPayload } from '../../snackbar.slice';
import Success from './success';
import UnidentifiedError from '@home/widgets/snackbar-notifications/notifications/components/unidentified-error';

const RatingUpdated: FC<RatingUpdatedPayload> = ({ details }) => {
  return details.success ? (
    <Success buildingId={details.buildingId} />
  ) : (
    <UnidentifiedError details={details.error.details} />
  );
};

export default RatingUpdated;
