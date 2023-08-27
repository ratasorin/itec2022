import { FC } from 'react';
import { RatingDeletedPayload } from '../../snackbar.slice';
import Success from './success';
import UnidentifiedError from '@home/widgets/snackbar-notifications/notifications/components/unidentified-error';

const RatingDeleted: FC<RatingDeletedPayload> = ({ details }) => {
  return details.success ? (
    <Success buildingId={details.building_id} />
  ) : (
    <UnidentifiedError details={details.error} />
  );
};

export default RatingDeleted;
