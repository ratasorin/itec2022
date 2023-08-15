import { OfficeTimeInterval } from '@shared';
import { create } from 'zustand';

interface BookingModalPayload {
  end: number;
  occupantName: string | null;
  start: number;
  id: string;
}

interface BookingModalState {
  payload: BookingModalPayload;
  render: boolean;
}

interface BookingModalStore {
  bookingModalState: BookingModalState;
  open: (payload: BookingModalPayload) => void;
  close: () => void;
}

const bookingModalState: BookingModalState = {
  payload: { end: 0, occupantName: null, start: 0, id: '' },
  render: false,
};

export const useBookingModal = create<BookingModalStore>()((set) => ({
  bookingModalState,
  open: (payload) => {
    set({ bookingModalState: { payload, render: true } });
  },
  close: () => set({ bookingModalState }),
}));
