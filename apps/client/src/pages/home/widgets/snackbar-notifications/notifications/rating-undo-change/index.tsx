import { FC } from 'react';
import { RatingUndoChangePayload } from '../../snackbar.slice';
import CheckIcon from '@mui/icons-material/Check';
import Success from './success';
import UnidentifiedError from './unidentified-error';

const RatingUndoUpdate: FC<RatingUndoChangePayload> = ({ details }) => {
  return details.success ? (
    <Success details={details} />
  ) : (
    <UnidentifiedError details={details.details} />
  );
};

export default RatingUndoUpdate;
