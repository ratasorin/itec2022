import { fetchProtectedRoute } from '@client/api/protected';
import { UnknownRatingError } from '@shared';
import { useMutation } from '@tanstack/react-query';
import { FC } from 'react';
import { useSnackbarNotifications } from '../../../snackbar.slice';
import { queryClient } from '@client/main';

const DeleteButton: FC<{ buildingId: string }> = ({ buildingId }) => {
  const openNotification = useSnackbarNotifications((state) => state.open);
  const deleteBuildingRating = useMutation({
    mutationFn: () => {
      return fetchProtectedRoute(`/rating/building/delete/${buildingId}`, {
        method: 'POST',
      });
    },
    onSuccess: async (response) => {
      if (!response.ok) {
        const error: UnknownRatingError | undefined = await response.json();
        if (!error?.cause) {
          openNotification({ type: 'default-error' });
          return;
        }

        openNotification({
          type: 'delete-rating',
          details: { success: false, error: error.details },
        });
      }
      queryClient.invalidateQueries({ queryKey: ['building', buildingId] });
      openNotification({
        type: 'delete-rating',
        details: { success: true, building_id: buildingId },
      });
    },
  });
  return (
    <button
      onClick={() => {
        deleteBuildingRating.mutate();
      }}
      className="mr-3 rounded-md border border-red-500 py-1 px-2 text-red-500"
    >
      DELETE
    </button>
  );
};

export default DeleteButton;
