import { createPortal } from 'react-dom';
import { useSnackbarNotifications } from './snackbar.slice';
import { useEffect } from 'react';
import RatingAdded from './notifications/rating-posted';
import DefaultNotificationError from './notifications/default-error';
import RatingUpdated from './notifications/rating-updated';
import RatingUndoUpdate from './notifications/rating-undo-change';
import NotificationBase from './notifications/components/notification-base';
import RatingDeleted from './notifications/rating-deleted';

const snackbarParent = document.getElementById('snackbar');
if (!snackbarParent) throw new Error('CANNOT RENDER SNACKBAR!');

const HomeSnackbar = () => {
  const notifications = useSnackbarNotifications(
    (state) => state.notifications
  );

  const closeAll = useSnackbarNotifications((state) => state.closeAll);

  useEffect(() => {
    return () => {
      closeAll();
    };
  }, []);

  useEffect(() => {
    const snackbar = document.getElementById('snackbar-content');
    if (!snackbar) return;

    snackbar.scroll({ top: -snackbar.scrollHeight });
  }, [notifications]);

  return createPortal(
    <div
      id="snackbar-content"
      className="absolute bottom-10 right-0 flex max-h-96 flex-col-reverse items-end overflow-y-auto pr-10"
    >
      {notifications.map(({ payload, id: notificationId }) => {
        return (
          <NotificationBase
            key={notificationId}
            notificationId={notificationId}
          >
            {payload.type === 'default-error' ? (
              <DefaultNotificationError />
            ) : payload.type === 'post-rating' ? (
              <RatingAdded {...payload} />
            ) : payload.type === 'update-rating' ? (
              <RatingUpdated {...payload} />
            ) : payload.type === 'rating-undo-change' ? (
              <RatingUndoUpdate {...payload} />
            ) : payload.type === 'delete-rating' ? (
              <RatingDeleted {...payload} />
            ) : null}
          </NotificationBase>
        );
      })}
    </div>,
    snackbarParent
  );
};

export default HomeSnackbar;
