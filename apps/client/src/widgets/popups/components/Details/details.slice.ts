import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SpacesOnLevel } from '@shared';
import type { Blueprint } from '../../../interface/Blueprint';

type DetailsBlueprint = Blueprint<SpacesOnLevel>;
export type DetailsPopupBlueprint = DetailsBlueprint['Component'];
export type DetailsActionBlueprint = DetailsBlueprint['Action'];

const initialState: DetailsPopupBlueprint = {
  payload: {
    book_until: null,
    name: null,
    space_id: -1,
    x: -1,
    y: -1,
  },
  specification: { render: false },
};

const details = createSlice({
  initialState,
  name: 'details-popup',
  reducers: {
    open: (_, action: PayloadAction<DetailsBlueprint['Action']>) => ({
      ...action.payload,
      specification: {
        ...action.payload.specification,
        render: true,
      },
    }),
    close: () => initialState,
  },
});

export default details.reducer;
export const detailsPopupName = details.name;
export const { open, close } = details.actions;
