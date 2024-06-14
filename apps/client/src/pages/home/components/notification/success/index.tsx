import React, { FC } from 'react';
import {
  SuccessNotificationPayload,
  useNotification,
} from '../notification.slice';
import { Button } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { fetchProtectedRoute } from '@client/api/fetch-protected';
import { queryClient } from '@client/main';
import { i_BuildingReviewServerError } from '@shared';

type i_DeleteReviewMutationParams = {
  rating_id: string;
};

const ReviewSuccess: FC<SuccessNotificationPayload> = ({
  building_id,
  building_name,
  rating_id,
  stars,
}) => {
  const { updateNotification } = useNotification();
  const deleteRating = useMutation({
    mutationFn: ({ rating_id }: i_DeleteReviewMutationParams) => {
      return fetchProtectedRoute(`/rating/building/delete/${rating_id}`, {
        method: 'POST',
      });
    },
    onSuccess: async (response) => {
      // error handling
      if (!response.ok) {
        const error = (await response.json()) as
          | i_BuildingReviewServerError
          | undefined;

        if (!error?.error) {
          // if the error cause is not specified return a generic error
          updateNotification({
            type: 'error',
            error: 'Unknown error occurred on the server!',
          });
          return;
        }

        // if the error cause is specified return a more detailed error
        updateNotification({
          type: 'error',
          error: error.error,
        });
        return;
      }

      updateNotification(null);

      queryClient.invalidateQueries({
        queryKey: ['building', building_id],
      });
    },
  });

  return (
    <div className="flex flex-row items-center rounded-lg border-2 border-gray-300 bg-white px-5 py-3 shadow-md">
      Added a{' '}
      <span className="mx-2 rounded-lg border-2 border-yellow-300 bg-yellow-100 px-2 py-1">
        {stars}⭐
      </span>{' '}
      review for{' '}
      <span className="mx-2 rounded-lg border-2 border-slate-300 bg-slate-100 px-2 py-1">
        {building_name}
      </span>
      <Button
        variant="text"
        className="ml-4 border-red-500 px-1 py-[2px] text-base text-red-700 hover:border-red-700 hover:bg-red-500/10"
        onClick={() => {
          deleteRating.mutate({ rating_id: rating_id });
        }}
      >
        DELETE
      </Button>
    </div>
  );
};

export default ReviewSuccess;
