import { FC } from 'react';
import { RatingUndoChangePayload } from '../../snackbar.slice';
import Success from './success';
import UnidentifiedError from '@home/widgets/snackbar-notifications/notifications/components/unidentified-error';

const RatingUndoUpdate: FC<RatingUndoChangePayload> = ({ details }) => {
  return details.success ? (
    <Success details={details} />
  ) : (
    <UnidentifiedError details={details.details} />
  );
};

export default RatingUndoUpdate;
