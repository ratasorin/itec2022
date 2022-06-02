import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Omit } from '../../../../helpers/Omit';

export interface Notification {
  visible: boolean;
  message: string;
}

const notification = createSlice({
  initialState: {
    visible: false,
    message: '',
  } as Notification,
  name: 'notification-popup',
  reducers: {
    open: (_, action: PayloadAction<string>) => ({
      visible: true,
      message: action.payload,
    }),
    close: () => ({ visible: false, message: '' }),
  },
});

export default notification.reducer;
export const notificationPopupName = notification.name;
export const { open, close } = notification.actions;
export const notificationPopupState = notification.getInitialState();
type OmitVisible = Omit<Notification, 'visible'>;
export const notificationPopupProps = Omit<OmitVisible>(
  notificationPopupState,
  'visible'
);
