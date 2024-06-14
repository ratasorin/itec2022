import { FC } from 'react';
import { useRatingPopup } from '../rating-popup/rating.slice';
import { useQuery } from '@tanstack/react-query';
import { SERVER_URL } from '@client/constants/server';
import { i_BuildingReviewStats } from '@shared';
import { Rating } from '@mui/material';
import RatingPopup from '../rating-popup';

const Ratings: FC<{ building_id: string; building_name: string }> = ({
  building_id,
  building_name,
}) => {
  const openRatingPopup = useRatingPopup((state) => state.open);
  const { data, isLoading, error } = useQuery({
    queryKey: ['building', building_id],
    queryFn: async (): Promise<i_BuildingReviewStats> => {
      const response = await fetch(
        SERVER_URL + `/rating/building/${building_id}`
      );
      return await response.json();
    },
  });

  if (!data || error)
    return (
      <div className="row-start-2 hover:cursor-pointer">
        There was a problem with retrieving reviews for {building_id}
      </div>
    );

  if (isLoading)
    return <div className="row-start-2 hover:cursor-pointer">Loading ...</div>;

  return (
    <div
      className="row-start-2 hover:cursor-pointer"
      onMouseOver={() => {
        openRatingPopup({
          anchorElementId: `${building_id}-rating`,
          building_id,
          stars: data.stars || 0,
          reviews: data.reviews,
          building_name,
        });
      }}
    >
      <Rating
        id={`${building_id}-rating`}
        name="rating"
        value={data.stars || 0}
        readOnly
      />
      <RatingPopup />
    </div>
  );
};

export default Ratings;
