import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Omit } from '../../../../helpers/Omit';
import type { Blueprint } from '../../../interface/Blueprint';

interface NotificationPayload {
  message: string;
}

type NotificationBlueprint = Blueprint<NotificationPayload>;
export type NotificationPopupBlueprint = NotificationBlueprint['Component'];
export type NotificationActionBlueprint = NotificationBlueprint['Action'];

const initialState: NotificationPopupBlueprint = {
  payload: {
    message: '',
  },
  specification: {
    render: false,
  },
};

const notification = createSlice({
  initialState,
  name: 'notification-popup',
  reducers: {
    open: (_, action: PayloadAction<NotificationActionBlueprint>) => ({
      ...action.payload,
      specification: {
        render: true,
        ...action.payload.specification,
      },
    }),
    close: () => initialState,
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
