import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { add } from 'date-fns';

export type UnixTimestamp = number;

export interface Interval {
  start: UnixTimestamp;
  end: UnixTimestamp;
}

export interface Timeline {
  bounds: Interval;
  selectedRange: Interval;
}

const initialState: Timeline = {
  bounds: {
    end: add(new Date(), { days: 1 }).getTime(),
    start: new Date().getTime(),
  },
  selectedRange: {
    end: add(new Date(), { days: 1 }).getTime(),
    start: new Date().getTime(),
  },
};

const timeline = createSlice({
  initialState,
  name: 'timeline-limits',
  reducers: {
    alterBounds: (
      state,
      action: PayloadAction<{
        interval: Partial<Interval>;
        update: 'bounds' | 'selectedRange';
      }>
    ) => {
      const { interval, update } = action.payload;
      const { end, start } = interval;

      if (end && start) return { ...state, [update]: interval };
      if (end) return { ...state, [update]: { ...state[update], end } };
      if (start) return { ...state, [update]: { ...state[update], start } };

      return state;
    },
  },
});

export default timeline.reducer;
export const { alterBounds } = timeline.actions;
