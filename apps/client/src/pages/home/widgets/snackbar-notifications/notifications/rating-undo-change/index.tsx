import { FC } from 'react';
import { RatingUndoChangePayload } from '../../snackbar.slice';
import CheckIcon from '@mui/icons-material/Check';
import { useMutation } from '@tanstack/react-query';
import { fetchProtectedRoute } from '@client/api/protected';
import { useSnackbarNotifications } from '../../snackbar.slice';
import { UndoRatingUpdateSuccess } from '@shared';
import { queryClient } from '@client/main';
import StarIcon from '@mui/icons-material/Star';

const RatingUndoUpdate: FC<RatingUndoChangePayload> = ({ details }) => {
  const openNotification = useSnackbarNotifications((state) => state.open);

  const undoRatingUpdate = useMutation({
    mutationFn: () => {
      return fetchProtectedRoute(`/rating/buildings/undo`, {
        method: 'POST',
      });
    },
    onSuccess: async (response) => {
      if (!response.ok) {
        // TODO: better error handling here!
        openNotification({ type: 'default-error' });
        return;
      }

      queryClient.invalidateQueries({
        queryKey: ['building', details.buildingId],
      });
      const payload = (await response.json()) as UndoRatingUpdateSuccess;
      openNotification({
        type: 'rating-undo-change',
        details: { success: true, ...payload },
      });
    },
  });
  return (
    <>
      <div className="mr-2 rounded-full text-green-500">
        <CheckIcon className="h-6 w-6" />
      </div>
      <div className="mr-2 flex flex-col">
        <span className="font-semibold"> Successfully reverted changes </span>
        <div className="mb-4 text-gray-500">
          The rating:
          <div className="grid grid-cols-3 grid-rows-2">
            <span className="col-start-1 row-start-1 mr-2 p-1">
              Before undo:
            </span>
            <span className="col-start-1 row-start-2 inline-flex max-h-min max-w-min items-center justify-center self-center justify-self-start rounded-md border-2 border-zinc-200 px-2 shadow-sm">
              {details.beforeUndo.deleted ? (
                <span>DELETED</span>
              ) : (
                <>
                  <span className="mt-[2px] mr-1 text-lg">
                    {details.beforeUndo.stars}
                  </span>
                  <StarIcon className="h-5 w-5 text-amber-400" />
                </>
              )}
            </span>
            <span className="col-start-2 row-start-1 p-1">Now:</span>
            <span className="col-start-2 row-start-2 inline-flex items-center justify-center self-center justify-self-start rounded-md border-2 border-zinc-200 px-2 shadow-sm">
              {details.afterUndo.deleted ? (
                <span>DELETED</span>
              ) : (
                <>
                  <span className="mt-[2px] mr-1 text-lg">
                    {details.afterUndo.stars}
                  </span>
                  <StarIcon className="h-5 w-5 text-amber-400" />
                </>
              )}
            </span>

            <span className="col-start-3 row-start-1 p-1">After undo:</span>
            <span className="col-start-3 row-start-2 self-center justify-self-start">
              {details.nextUndo.deleted === null ||
              details.nextUndo.stars === null
                ? 'NULL'
                : null}
            </span>
          </div>
        </div>
        <div className="mb-1 flex flex-row">
          <button
            onClick={() => {
              undoRatingUpdate.mutate();
            }}
            className="mr-3 rounded-md border border-slate-500 py-1 px-2 text-slate-700 disabled:border-slate-400 disabled:text-slate-400"
            disabled={
              details.nextUndo.deleted === null ||
              details.nextUndo.stars === null
            }
          >
            UNDO
          </button>
          <button className="mr-3 rounded-md border border-red-500 py-1 px-2 text-red-500">
            DELETE
          </button>
        </div>
      </div>
    </>
  );
};

export default RatingUndoUpdate;
