import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../../hooks/redux/redux.hooks';

const floorSlice = createSlice({
  initialState: 1,
  name: 'floor',
  reducers: {
    changeFloor(_, action: PayloadAction<number>) {
      return action.payload;
    },
  },
});

export default floorSlice.reducer;
const { changeFloor } = floorSlice.actions;
export const useFloor = () => {
  return useAppSelector(({ floor }) => floor);
};

export const useUpdateFloor = () => {
  const dispatch = useAppDispatch();
  return (id: number) => dispatch(changeFloor(id));
};
