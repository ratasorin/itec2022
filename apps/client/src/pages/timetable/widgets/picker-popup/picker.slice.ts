import { OfficeTimeInterval } from '@shared';
import { create } from 'zustand';

interface Box {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface PickerPopupPayload {
  id: string;
  interval: OfficeTimeInterval;
  box: Box;
}

interface PickerPopupState {
  payload: PickerPopupPayload;
  render: boolean;
}

interface PickerPopupStore {
  pickerPopupState: PickerPopupState;
  open: (payload: PickerPopupPayload) => void;
  close: () => void;
}

const pickerPopupState: PickerPopupState = {
  payload: {
    id: '',
    interval: {
      end: 0,
      occupantName: null,
      start: 0,
    },
    box: {
      height: -1,
      left: -1,
      top: -1,
      width: -1,
    },
  },

  render: false,
};

export const usePickerPopup = create<PickerPopupStore>()((set) => ({
  pickerPopupState,
  open: (payload) => set({ pickerPopupState: { payload, render: true } }),
  close: () => set({ pickerPopupState }),
}));
