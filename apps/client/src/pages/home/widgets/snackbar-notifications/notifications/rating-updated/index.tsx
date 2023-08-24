import { FC } from 'react';
import {
  RatingUpdatedPayload,
  useSnackbarNotifications,
} from '../../snackbar.slice';
import CloseIcon from '@mui/icons-material/Close';
import Success from './success';
import UnidentifiedError from '../rating-posted/unidentified-error';

const RatingUpdated: FC<RatingUpdatedPayload & { notificationId: string }> = ({
  details,
  notificationId,
}) => {
  const closeNotification = useSnackbarNotifications((state) => state.close);
  return (
    <div className="mb-4 rounded-md border-2 border-zinc-200 bg-white p-3 font-mono shadow-md">
      <div className="flex flex-row items-start">
        {details.success ? (
          <Success updateId={details.updateId} />
        ) : (
          <UnidentifiedError details={details.error.details} />
        )}
        <button
          onClick={() => {
            closeNotification(notificationId);
          }}
          className="ml-4 flex flex-shrink-0 items-center justify-center rounded-full text-gray-500"
        >
          <CloseIcon className="mt-1 h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default RatingUpdated;
