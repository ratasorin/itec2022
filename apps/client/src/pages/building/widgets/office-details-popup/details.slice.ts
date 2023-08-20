import { create } from 'zustand';

interface DetailsPopupPayload {
  booked_until: null | string;
  occupantName: null | string;
  officeName: string;
  office_id: string;
  x: number;
  y: number;
  box: Box;
}

interface Box {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface DetailsPopupState {
  payload: DetailsPopupPayload;
  render: boolean;
}

const detailsPopupState: DetailsPopupState = {
  payload: {
    booked_until: null,
    occupantName: null,
    officeName: '',
    office_id: '',
    x: -1,
    y: -1,
    box: {
      top: -1,
      left: -1,
      width: -1,
      height: -1,
    },
  },
  render: false,
};

interface DetailsPopupStore {
  detailsPopupState: DetailsPopupState;
  open: (payload: DetailsPopupPayload) => void;
  close: () => void;
}

export const useDetailsPopup = create<DetailsPopupStore>()((set) => ({
  detailsPopupState,
  open: (payload) => {
    set(() => ({
      detailsPopupState: {
        payload,
        render: true,
      },
    }));
  },
  close: () => {
    set({ detailsPopupState });
  },
}));
