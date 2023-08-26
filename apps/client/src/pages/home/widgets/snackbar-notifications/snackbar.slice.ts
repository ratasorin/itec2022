import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import {
  InsertRatingSuccess,
  RatingErrorOnInsert,
  UndoRatingUpdateSuccess,
  UnknownRatingError,
  UpdateRatingSuccess,
} from '@shared';

export interface RatingAddedPayload {
  type: 'post-rating';
  details:
    | ({ success: true } & InsertRatingSuccess)
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
    | ({ success: true } & UpdateRatingSuccess)
    | {
        success: false;
        error: UnknownRatingError;
      };
}

export interface RatingUndoChangePayload {
  type: 'rating-undo-change';
  details:
    | ({
        success: true;
      } & UndoRatingUpdateSuccess)
    | { success: false; details: string };
}

type SnackbarNotificationsPayload =
  | RatingAddedPayload
  | RatingUndoChangePayload
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
