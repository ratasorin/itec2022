import CheckIcon from '@mui/icons-material/Check';
import { useMutation } from '@tanstack/react-query';
import { fetchProtectedRoute } from 'apps/client/src/api/protected';
import { useSnackbarNotifications } from '../../snackbar.slice';
import { queryClient } from 'apps/client/src/main';
import { UndoRatingUpdateSuccess } from '@shared';
import { FC } from 'react';

const Success: FC<{ buildingId: string }> = ({ buildingId }) => {
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

      queryClient.invalidateQueries({ queryKey: ['building', buildingId] });
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
        <span className="font-semibold"> Rating successfully modified </span>
        <span className="mb-2 text-gray-500">
          Your rating has been successfully modified! Thank you!
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

export default Success;
