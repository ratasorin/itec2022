import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OfficeTimeInterval } from '@shared';
import type { Blueprint } from '../../../interface/Blueprint';

interface PickerPayload {
  id: string;
  interval: OfficeTimeInterval;
}

type PickerBlueprint = Blueprint<PickerPayload>;
export type PickerPopupBlueprint = PickerBlueprint['Component'];
export type PickerActionBlueprint = PickerBlueprint['Action'];

const initialState: PickerPopupBlueprint = {
  specification: {
    render: false,
    box: null,
  },
  payload: {
    id: '',
    interval: {
      end: 0,
      occupantName: null,
      start: 0,
    },
  },
};

const picker = createSlice({
  initialState,
  name: 'picker-popup',
  reducers: {
    open: (state, action: PayloadAction<PickerActionBlueprint>) => {
      if (
        JSON.stringify(state.payload) === JSON.stringify(action.payload.payload)
      )
        return state;

      return {
        payload: {
          id: action.payload.payload.id,
          interval: {
            end: action.payload.payload.interval.end,
            start: action.payload.payload.interval.start,
            occupantName: action.payload.payload.interval.occupantName,
          },
        },
        specification: {
          render: true,
          ...action.payload.specification,
        },
      };
    },

    close: () => initialState,
  },
});

export default picker.reducer;
export const pickerPopupName = picker.name;
export const { close: pickerPopupClose, open: pickerPopupOpen } =
  picker.actions;
