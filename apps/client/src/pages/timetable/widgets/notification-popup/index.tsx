import { useEffect } from 'react';
import { useNotificationPopup } from './notification.slice';
import ReactDOM from 'react-dom';

const NotificationPopup = () => {
  const { payload, render } = useNotificationPopup(
    (state) => state.notificationState
  );
  const closeNotificationPopup = useNotificationPopup((state) => state.close);

  useEffect(() => {
    return () => {
      closeNotificationPopup();
    };
  }, []);
  if (!render) return null;
  return ReactDOM.createPortal(
    <div>{payload.message}</div>,
    document.getElementById('widgets')!
  );
};

export default NotificationPopup;
