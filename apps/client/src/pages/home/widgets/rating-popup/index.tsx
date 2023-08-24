import { useEffect, useState } from 'react';
import { useRatingPopup } from './rating.slice';
import { Button, Popper, Rating } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { fetchProtectedRoute } from 'apps/client/src/api/protected';
import { useSnackbarNotifications } from '../snackbar-notifications/snackbar.slice';
import useHandleClickOutside from 'apps/client/src/hooks/click-outside';
import { InsertRatingSuccess, RatingErrorOnInsert } from '@shared';
import { queryClient } from 'apps/client/src/main';

const RatingPopup = () => {
  const { payload, render } = useRatingPopup(
    (payload) => payload.ratingPopupState
  );
  const closeRatingPopup = useRatingPopup((state) => state.close);

  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    console.log({ payload });
  }, [payload]);
  useEffect(() => {
    console.log(payload.anchorElementId);
    if (!payload.anchorElementId) return;
    const element = document.getElementById(payload.anchorElementId);
    if (!element) return;

    console.log({ element });

    setAnchorElement(element);
  }, [payload.anchorElementId]);

  const [stars, setStars] = useState(0);
  const addNotification = useSnackbarNotifications((state) => state.open);

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
      if (!response.ok) {
        const error: RatingErrorOnInsert | undefined = await response.json();
        if (!error?.cause) {
          addNotification({
            type: 'default-error',
          });
          return;
        }

        addNotification({
          type: 'post-rating',
          details: { error, success: false },
        });

        return;
      }

      queryClient.invalidateQueries({
        queryKey: ['building', payload.building_id],
      });
      const rating = (await response.json()) as InsertRatingSuccess;
      addNotification({
        type: 'post-rating',
        details: { success: true, ...rating },
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
      <div className="mt-3 flex flex-col items-start rounded-md border-2 border-zinc-200 bg-white p-4 font-mono shadow-md">
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
          className="ml-auto border-black text-black hover:border-black hover:bg-black/5"
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
