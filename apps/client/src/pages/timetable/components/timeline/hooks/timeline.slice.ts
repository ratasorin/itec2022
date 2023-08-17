import { add } from 'date-fns';
import { create } from 'zustand';

export type UnixTimestamp = number;

export interface Interval {
  start: UnixTimestamp;
  end: UnixTimestamp;
}

export interface TimelineState {
  bounds: Interval;
  selectedRange: Interval;
}

interface TimelinePayload {
  interval: Partial<Interval>;
  update: keyof TimelineState;
}

interface TimelineStore {
  timelineState: TimelineState;
  alterBounds: (payload: TimelinePayload) => void;
}

const timelineState: TimelineState = {
  bounds: {
    end: add(new Date(), { days: 1 }).getTime(),
    start: new Date().getTime(),
  },
  selectedRange: {
    end: add(new Date(), { days: 1 }).getTime(),
    start: new Date().getTime(),
  },
};

export const useTimeline = create<TimelineStore>()((set) => ({
  timelineState,
  alterBounds: (payload: TimelinePayload) => {
    const { interval, update } = payload;
    const { end, start } = interval;

    if (end && start)
      set((state) => ({
        ...state,
        timelineState: {
          ...state.timelineState,
          [update]: { end, start },
        },
      }));
    if (end)
      set((state) => ({
        ...state,
        timelineState: {
          ...state.timelineState,
          [update]: { ...state.timelineState[update], end },
        },
      }));
    if (start)
      set((state) => ({
        ...state,
        timelineState: {
          ...state.timelineState,
          [update]: { ...state.timelineState[update], start },
        },
      }));
  },
}));
