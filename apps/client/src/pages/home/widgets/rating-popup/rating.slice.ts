import { create } from 'zustand';

interface RatingPopupPayload {
  building_id: string;
  anchorElementId: string;
  stars: number;
  reviews: number;
}

interface RatingPopupState {
  payload: RatingPopupPayload;
  render: boolean;
}

const ratingPopupState: RatingPopupState = {
  payload: {
    anchorElementId: '',
    building_id: '',
    stars: -1,
    reviews: -1,
  },
  render: false,
};

interface RatingPopupStore {
  ratingPopupState: RatingPopupState;
  open: (payload: RatingPopupPayload) => void;
  close: () => void;
}

export const useRatingPopup = create<RatingPopupStore>()((set) => ({
  ratingPopupState,
  open: (payload) => {
    set(() => ({
      ratingPopupState: {
        payload,
        render: true,
      },
    }));
  },
  close: () => {
    set({ ratingPopupState });
  },
}));
