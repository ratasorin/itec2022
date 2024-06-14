import { Snackbar } from '@mui/material';
import { useNotification } from './notification.slice';
import ReviewSuccess from './success';

const Notifications = () => {
  const { notification, updateNotification } = useNotification();

  return (
    <Snackbar open={!!notification} onClose={() => updateNotification(null)}>
      <div>
        {notification ? (
          notification?.type === 'error' ? (
            notification.error
          ) : (
            <ReviewSuccess {...notification.payload}></ReviewSuccess>
          )
        ) : null}
      </div>
    </Snackbar>
  );
};

export default Notifications;
