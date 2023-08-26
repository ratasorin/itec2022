import CheckIcon from '@mui/icons-material/Check';
import { useMutation } from '@tanstack/react-query';
import { fetchProtectedRoute } from '@client/api/protected';
import { FC } from 'react';
import { useSnackbarNotifications } from '../../snackbar.slice';
import {
  InsertRatingSuccess,
  UndoRatingUpdateSuccess,
  UnknownRatingError,
} from '@shared';
import { queryClient } from '@client/main';

const Success: FC<InsertRatingSuccess> = ({ buildingId }) => {
  const { open } = useSnackbarNotifications();
  const undoRatingUpdate = useMutation({
    mutationFn: () => {
      return fetchProtectedRoute(`/rating/buildings/undo/`, {
        method: 'POST',
      });
    },

    onSuccess: async (response) => {
      if (!response.ok) {
        const error = (await response.json()) as UnknownRatingError | undefined;
        console.log({ error });
        if (!error?.cause) {
          open({ type: 'default-error' });
          return;
        }

        open({
          type: 'rating-undo-change',
          details: { success: false, details: error.details },
        });

        return;
      }

      queryClient.invalidateQueries({ queryKey: ['building', buildingId] });
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
