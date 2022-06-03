import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SpacesOnLevel } from '@shared';
import { Omit } from '../../../../helpers/Omit';

export interface Details {
  visible: boolean;
  boundingBox: DOMRect;
  space: SpacesOnLevel;
}

const details = createSlice({
  initialState: {
    visible: false,
    space: {},
  } as Details,
  name: 'details-popup',
  reducers: {
    open: (
      _,
      action: PayloadAction<{
        space: SpacesOnLevel;
        boundingBox: DOMRect;
      }>
    ) => ({
      visible: true,
      ...action.payload,
    }),
    close: (payload) => ({ ...payload, visible: false }),
  },
});

export default details.reducer;
export const detailsPopupName = details.name;
export const { open, close } = details.actions;
export const detailsPopupState = details.getInitialState();

type OmitVisible = Omit<Details, 'visible'>;
export const detailsPopupProps = Omit<OmitVisible>(
  detailsPopupState,
  'visible'
);
