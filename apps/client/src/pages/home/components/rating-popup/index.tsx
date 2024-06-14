import { useEffect, useState } from 'react';
import { useRatingPopup } from './rating.slice';
import { Button, Popper, Rating } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { fetchProtectedRoute } from '@client/api/fetch-protected';
import useHandleClickOutside from '@client/hooks/click-outside';
import {
  i_BuildingReviewServerError,
  i_InsertBuildingReviewResponse,
} from '@shared';
import { queryClient } from '@client/main';
import { useNotification } from '../../components/notification/notification.slice';

const RatingPopup = () => {
  const { payload, render } = useRatingPopup(
    (payload) => payload.ratingPopupState
  );
  const closeRatingPopup = useRatingPopup((state) => state.close);

  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

  const { updateNotification } = useNotification();

  useEffect(() => {
    if (!payload.anchorElementId) return;
    const element = document.getElementById(payload.anchorElementId);
    if (!element) return;

    setAnchorElement(element);
  }, [payload.anchorElementId]);

  const [stars, setStars] = useState(0);
  useEffect(() => {
    if (!render) setStars(0);
  }, [render]);

  useHandleClickOutside('rating-popup', closeRatingPopup, render);

  const postRating = useMutation({
    mutationFn: ({
      building_id,
      stars,
    }: {
      building_id: string;
      stars: number;
    }) => {
      return fetchProtectedRoute(`/rating/building/${building_id}`, {
        body: JSON.stringify({ stars }),
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

      // force the building to refresh the state
      queryClient.invalidateQueries({
        queryKey: ['building', payload.building_id],
      });

      // display the popup
      const rating = (await response.json()) as i_InsertBuildingReviewResponse;
      updateNotification({
        type: 'success',
        payload: {
          building_id: payload.building_id,
          stars: rating.stars,
          rating_id: rating.rating_id,
          building_name: payload.building_name,
        },
      });
    },
  });

  if (!render) return false;
  return (
    <Popper
      id="rating-popup"
      open={render}
      container={document.getElementById('widgets')}
      anchorEl={anchorElement}
    >
      <div className="font-poppins mt-3 flex flex-col items-start rounded-md border-2 border-zinc-200 bg-white p-4 shadow-md">
        <span>This office got {payload.stars} stars</span>
        <span className="text-sm text-zinc-400">
          from {payload.reviews} reviews
        </span>
        <span className="mb-2" />
        Rate your experience
        <Rating
          name="rating"
          className="mb-2"
          value={stars || 0}
          onChange={(_, selectedStars) => {
            if (!selectedStars) return;

            setStars(selectedStars);
          }}
        />
        <Button
          variant="outlined"
          className="ml-auto border-black px-1 py-[2px] text-black hover:border-black hover:bg-black/10"
          onClick={() => {
            postRating.mutate({ building_id: payload.building_id, stars });
          }}
        >
          Post
        </Button>
      </div>
    </Popper>
  );
};

export default RatingPopup;
