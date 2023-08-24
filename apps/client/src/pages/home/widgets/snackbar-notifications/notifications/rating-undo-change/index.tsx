import { FC } from 'react';
import { RatingUndoChangePayload } from '../../snackbar.slice';
import CheckIcon from '@mui/icons-material/Check';
import { useMutation } from '@tanstack/react-query';
import { fetchProtectedRoute } from 'apps/client/src/api/protected';
import { useSnackbarNotifications } from '../../snackbar.slice';
import { UndoRatingUpdateSuccess } from '@shared';
import { queryClient } from 'apps/client/src/main';

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
        <span className="mb-2 text-gray-500">
          Before the undo the state was {JSON.stringify(details.beforeUndo)}.
          Now the state is {JSON.stringify(details.afterUndo)}. On the next undo
          the state is going to be {JSON.stringify(details.nextUndo)}
        </span>
        <div className="mb-1 flex flex-row">
          <button
            onClick={() => {
              undoRatingUpdate.mutate();
            }}
            className="mr-3 rounded-md border border-slate-500 py-1 px-2 text-slate-700"
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
