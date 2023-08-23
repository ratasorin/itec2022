import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import {
  InsertRatingResponse,
  RatingErrorOnInsert,
  UnknownRatingError,
} from '@shared';

export interface RatingAddedPayload {
  type: 'post-rating';
  details:
    | ({ success: true } & InsertRatingResponse)
    | {
        success: false;
        error: RatingErrorOnInsert;
      };
}

export interface DefaultErrorPayload {
  type: 'default-error';
}

export interface RatingUpdatedPayload {
  type: 'update-rating';
  details:
    | { success: true; ratingId: string }
    | {
        success: false;
        error: UnknownRatingError;
      };
}

export interface RatingDeletedPayload {
  type: 'delete-rating';
  success: boolean;
}

type SnackbarNotificationsPayload =
  | RatingAddedPayload
  | RatingDeletedPayload
  | DefaultErrorPayload
  | RatingUpdatedPayload;

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
