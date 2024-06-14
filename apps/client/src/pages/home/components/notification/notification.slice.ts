import { create } from 'zustand';

export type SuccessNotificationPayload = {
  stars: number;
  building_name: string;
  rating_id: string;
  building_id: string;
};

type SuccessNotification = {
  type: 'success';
  payload: SuccessNotificationPayload;
};

type ErrorNotification = {
  type: 'error';
  error: string;
};

type Notification = ErrorNotification | SuccessNotification;

interface NotificationState {
  notification: Notification | null;
  updateNotification: (n: Notification | null) => void;
}

export const useNotification = create<NotificationState>()((set) => ({
  notification: null,
  updateNotification: (n) => {
    set(() => ({ notification: n }));
  },
}));
