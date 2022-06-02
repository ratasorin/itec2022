import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RetrievedSpaces } from '@shared';
import { Omit } from '../../../../helpers/Omit';

export interface Details {
  visible: boolean;
  space: RetrievedSpaces;
}

const details = createSlice({
  initialState: {
    visible: false,
    space: {},
  } as Details,
  name: 'details-popup',
  reducers: {
    open: (_, action: PayloadAction<RetrievedSpaces>) => ({
      visible: true,
      space: action.payload,
    }),
    close: () => ({ visible: false, space: {} as RetrievedSpaces }),
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
