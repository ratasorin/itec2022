import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OfficeTimeInterval } from '@shared';
import { Blueprint } from '../../../interface/Blueprint';

type BookingBlueprint = Blueprint<OfficeTimeInterval & { id: string }>;
export type BookingActionBlueprint = BookingBlueprint['Action'];
export type BookingModalBlueprint = BookingBlueprint['Component'];

const initialState: BookingModalBlueprint = {
  specification: { render: false },
  payload: { end: '', occupantName: null, start: '', id: '' },
};

const booking = createSlice({
  initialState,
  name: 'booking-modal',
  reducers: {
    open: (_, action: PayloadAction<BookingActionBlueprint>) => ({
      ...action.payload,
      specification: { ...action.payload.specification, render: true },
    }),
    close: () => initialState,
  },
});

export default booking.reducer;
export const { close: bookingModalClose, open: bookingModalOpen } =
  booking.actions;
export const bookingModalName = booking.name;
