import { createPortal } from 'react-dom';
import { useSnackbarNotifications } from './snackbar.slice';
import { useEffect } from 'react';
import RatingAdded from './notifications/rating-posted';
import DefaultNotificationError from './notifications/default-error';
import RatingUpdated from './notifications/rating-updated';
import RatingUndoUpdate from './notifications/rating-undo-change';
import NotificationBase from './notifications/components/notification-base';

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

  return createPortal(
    <div className="absolute bottom-10 right-10 flex flex-col items-end">
      {notifications.map(({ payload, id: notificationId }) => {
        return (
          <NotificationBase notificationId={notificationId}>
            {payload.type === 'default-error' ? (
              <DefaultNotificationError />
            ) : payload.type === 'post-rating' ? (
              <RatingAdded {...payload} />
            ) : payload.type === 'update-rating' ? (
              <RatingUpdated {...payload} />
            ) : payload.type === 'rating-undo-change' ? (
              <RatingUndoUpdate {...payload} />
            ) : null}
          </NotificationBase>
        );
      })}
    </div>,
    document.getElementById('snackbar')!
  );
};

export default HomeSnackbar;
