import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { ErrorRating } from '@shared';

export interface RatingAddedPayload {
  type: 'post-rating';
  details:
    | { success: true; ratingId: string }
    | {
        success: false;
        error: ErrorRating;
      };
}

export interface RatingDeletedPayload {
  type: 'delete-rating';
  success: boolean;
}

export interface RatingUpdatedPayload {
  type: 'update-rating';
  success: boolean;
}

type SnackbarNotificationsPayload = RatingAddedPayload | RatingDeletedPayload;

export interface SnackbarNotificationsState {
  payload: SnackbarNotificationsPayload;
  id: string;
}

interface SnackbarNotificationsStore {
  notifications: SnackbarNotificationsState[];
  open: (payload: SnackbarNotificationsPayload) => void;
  close: (id: string) => void;
  closeAll: () => void;
}

const initialNotifications = [] as SnackbarNotificationsState[];

export const useSnackbarNotifications = create<SnackbarNotificationsStore>()(
  (set) => ({
    notifications: initialNotifications,
    open: (payload) => {
      set((state) => ({
        notifications: [...state.notifications, { payload, id: uuid() }],
      }));
    },
    close: (id) => {
      set((state) => ({
        notifications: [...state.notifications.filter((n) => n.id !== id)],
      }));
    },
    closeAll: () => {
      set({ notifications: initialNotifications });
    },
  })
);
