import { create } from 'zustand';

interface NotificationPopupPayload {
  message: string;
}

interface NotificationPopupState {
  payload: NotificationPopupPayload;
  render: boolean;
}

interface NotificationPopupStore {
  notificationState: NotificationPopupState;
  open: (payload: NotificationPopupPayload) => void;
  close: () => void;
}

const notificationState: NotificationPopupState = {
  payload: {
    message: '',
  },
  render: false,
};

export const useNotificationPopup = create<NotificationPopupStore>((set) => ({
  notificationState,
  open: (payload) => {
    set({ notificationState: { payload, render: true } });
  },
  close: () => {
    set({ notificationState });
  },
}));
