import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { add } from 'date-fns';

export interface Interval {
  start: Date;
  end: Date;
}

export interface Timeline {
  bounds: Interval;
  selectedRange: Interval;
}

const initialState: Timeline = {
  bounds: {
    end: add(new Date(), { days: 1 }),
    start: new Date(),
  },
  selectedRange: {
    end: add(new Date(), { days: 1 }),
    start: new Date(),
  },
};

const timeline = createSlice({
  initialState,
  name: 'timeline-limits',
  reducers: {
    alterBounds: (
      state,
      action: PayloadAction<{
        interval: { start?: Date; end?: Date };
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
