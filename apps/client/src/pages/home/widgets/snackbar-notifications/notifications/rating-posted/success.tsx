import CheckIcon from '@mui/icons-material/Check';
import { useMutation } from '@tanstack/react-query';
import { fetchProtectedRoute } from 'apps/client/src/api/protected';
import { FC } from 'react';
import { useSnackbarNotifications } from '../../snackbar.slice';
import { UndoRatingUpdateSuccess } from '@shared';
import { queryClient } from 'apps/client/src/main';

const Success: FC<{ ratingId: string; updateId: string }> = ({
  ratingId,
  updateId,
}) => {
  const { open } = useSnackbarNotifications();
  const undoRatingUpdate = useMutation({
    mutationFn: () => {
      return fetchProtectedRoute(`/rating/buildings/undo/${updateId}`, {
        method: 'POST',
      });
    },
    onSuccess: async (response) => {
      if (!response.ok) {
        // TODO: better error handling here!
        open({ type: 'default-error' });
        return;
      }

      queryClient.invalidateQueries({ queryKey: ['buildings'] });
      const payload = (await response.json()) as UndoRatingUpdateSuccess;
      open({
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
        <span className="font-semibold"> Rating successfully added </span>
        <span className="mb-2 text-gray-500">
          Your rating has been successfully uploaded! Thank you!
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
