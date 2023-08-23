import { createPortal } from 'react-dom';
import { useSnackbarNotifications } from './snackbar.slice';
import { useEffect } from 'react';
import RatingAdded from './notifications/rating-posted';

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
      {notifications.map((notification) =>
        notification.payload.type === 'post-rating' ? (
          <RatingAdded
            {...notification.payload}
            notificationId={notification.id}
          />
        ) : null
      )}
    </div>,
    document.getElementById('snackbar')!
  );
};

export default HomeSnackbar;
