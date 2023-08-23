import { createPortal } from 'react-dom';
import { useSnackbarNotifications } from './snackbar.slice';
import { useEffect } from 'react';
import RatingAdded from './notifications/rating-posted';
import DefaultNotificationError from './notifications/default-error';
import RatingUpdated from './notifications/rating-updated';

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
    <div className="absolute bottom-10 right-10">
      {notifications.map(({ payload, id: notificationId }) => {
        if (payload.type === 'default-error')
          return <DefaultNotificationError notificationId={notificationId} />;
        if (payload.type === 'post-rating')
          return <RatingAdded {...payload} notificationId={notificationId} />;
        if (payload.type === 'update-rating')
          return <RatingUpdated {...payload} notificationId={notificationId} />;

        return null;
      })}
    </div>,
    document.getElementById('snackbar')!
  );
};

export default HomeSnackbar;
