import { JwtUser } from '@shared';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const userSlice = createSlice({
  initialState: null as null | JwtUser,
  name: 'user',
  reducers: {
    updateUser(_, action: PayloadAction<JwtUser>) {
      return action.payload;
    },
  },
});

export default userSlice.reducer;
export const { updateUser } = userSlice.actions;
