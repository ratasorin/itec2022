import { useSelectWidget } from '../../../utils/select';
import { Notification } from './notification.slice';

const NotificationPopup = () => {
  const { visible, message } =
    useSelectWidget<Notification>('notification-popup');

  if (!visible) return null;
  return <div>{message}</div>;
};

export default NotificationPopup;
