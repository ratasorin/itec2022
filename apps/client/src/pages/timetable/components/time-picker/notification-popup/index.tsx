import { useNotificationPopup } from './notification.slice';
import ReactDOM from 'react-dom';

const NotificationPopup = () => {
  const { payload, render } = useNotificationPopup(
    (state) => state.notificationState
  );
  if (!render) return null;
  return ReactDOM.createPortal(<div>{payload.message}</div>, document.body);
};

export default NotificationPopup;
