import { useWidgetBlueprint } from '../../../hooks/useWidgetBlueprints';
import { NotificationPopupBlueprint } from './notification.slice';

const NotificationPopup = () => {
  const { payload, specification } =
    useWidgetBlueprint<NotificationPopupBlueprint>('notification-popup');

  if (!specification.render) return null;
  return <div>{payload.message}</div>;
};

export default NotificationPopup;
