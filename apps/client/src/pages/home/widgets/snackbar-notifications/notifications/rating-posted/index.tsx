import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Button, Rating } from '@mui/material';
import { FC, useState } from 'react';
import { RatingAddedPayload } from '../../snackbar.slice';
import { useSnackbarNotifications } from '../../snackbar.slice';
import { useMutation } from '@tanstack/react-query';
import { fetchProtectedRoute } from '@client/api/protected';
import Success from './success';
import UnidentifiedError from '@home/widgets/snackbar-notifications/notifications/components/unidentified-error';
import { queryClient } from '@client/main';
import { UpdateRatingSuccess } from '@shared';

const DuplicateReviewError: FC<{
  buildingId: string;
}> = ({ buildingId }) => {
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

      queryClient.invalidateQueries({ queryKey: ['building', buildingId] });
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

const RatingAdded: React.FC<RatingAddedPayload> = ({ details }) => {
  return details.success ? (
    <Success {...details} />
  ) : details.error.cause === 'UNIQUE REVIEWER CONSTRAINT FAILED' ? (
    <DuplicateReviewError buildingId={details.error.building_id} />
  ) : (
    <UnidentifiedError details={details.error.details} />
  );
};

export default RatingAdded;
