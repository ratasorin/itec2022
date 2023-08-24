import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Button, Rating } from '@mui/material';
import { FC, useState } from 'react';
import { RatingAddedPayload } from '../../snackbar.slice';
import { useSnackbarNotifications } from '../../snackbar.slice';
import { useMutation } from '@tanstack/react-query';
import { fetchProtectedRoute } from 'apps/client/src/api/protected';
import Success from './success';
import UnidentifiedError from './unidentified-error';
import { queryClient } from 'apps/client/src/main';
import { UpdateRatingSuccess } from '@shared';

const DuplicateReviewError: FC<{
  buildingId: string;
  notificationId: string;
}> = ({ buildingId, notificationId }) => {
  const [stars, setStars] = useState(0);
  const [update, setUpdate] = useState(false);
  const { open } = useSnackbarNotifications();
  const updateStars = useMutation({
    mutationFn: () => {
      return fetchProtectedRoute(`/rating/buildings/${buildingId}/update`, {
        method: 'POST',
        body: JSON.stringify({ stars }),
      });
    },
    onSuccess: async (response) => {
      if (!response.ok) {
        const error = await response.json();
        if (!error.cause) {
          open({ type: 'default-error' });
          return;
        }

        open({
          type: 'update-rating',
          details: { error, success: false },
        });

        return;
      }

      queryClient.invalidateQueries({ queryKey: ['buildings'] });
      const payload = (await response.json()) as UpdateRatingSuccess;
      open({ type: 'update-rating', details: { success: true, ...payload } });
    },
  });
  return (
    <>
      <div className="mr-2 rounded-full text-red-500">
        <ErrorOutlineIcon className="h-6 w-6" />
      </div>
      <div className="mr-2 flex flex-col">
        <span className="font-semibold">
          {' '}
          You've already submitted a rating!{' '}
        </span>
        <span className="mb-2 max-w-sm text-gray-500">
          <div>
            You cannot submit two ratings, but you can
            <br />
            <em>delete</em> or
            <em> update</em> the current one.
          </div>
          {update && (
            <div className="ml-2 flex flex-row items-center justify-around">
              <div>
                <div className="mt-2 text-black">Update rating:</div>
                <Rating
                  onChange={(event, stars) => {
                    setStars(stars || 0);
                  }}
                />
              </div>
              <Button
                variant="outlined"
                onClick={() => {
                  updateStars.mutate();
                }}
                className=" border-gray-500 font-mono text-black hover:border-gray-700 hover:bg-black/10"
              >
                SUBMIT
              </Button>
            </div>
          )}
        </span>
        <div className="mb-1 flex flex-row">
          <button
            onClick={() => setUpdate(!update)}
            className="mr-3 rounded-md border border-slate-500 py-1 px-2 text-slate-700"
          >
            {update ? 'CANCEL' : 'UPDATE'}
          </button>
          <button className="mr-3 rounded-md border border-red-500 py-1 px-2 text-red-500">
            FORCE DELETE
          </button>
        </div>
      </div>
    </>
  );
};

const RatingAdded: React.FC<
  RatingAddedPayload & { notificationId: string }
> = ({ details, notificationId }) => {
  const closeNotification = useSnackbarNotifications((state) => state.close);

  return (
    <div className="mb-4 rounded-md border-2 border-zinc-200 bg-white p-3 font-mono shadow-md">
      <div className="flex flex-row items-start">
        {details.success ? (
          <Success {...details} />
        ) : details.error.cause === 'UNIQUE REVIEWER CONSTRAINT FAILED' ? (
          <DuplicateReviewError
            buildingId={details.error.building_id}
            notificationId={notificationId}
          />
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

export default RatingAdded;
