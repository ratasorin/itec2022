import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Blueprint } from '../../../interface/Blueprint';
import { OfficeTimeInterval } from '@shared';

type BookingBlueprint = Blueprint<OfficeTimeInterval & { id: string }>;
export type BookingActionBlueprint = BookingBlueprint['Action'];
export type BookingModalBlueprint = BookingBlueprint['Component'];

const initialState: BookingModalBlueprint = {
  specification: { render: false },
  payload: { end: 0, occupantName: null, start: 0, id: '' },
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
