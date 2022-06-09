import { detailsPopupName } from '../../components/Details/details.slice';
import { notificationPopupName } from '../../components/Notification/notification.slice';
import { pickerPopupName } from '../../components/Picker/picker.slice';

const popups = [
  detailsPopupName,
  notificationPopupName,
  pickerPopupName,
] as const;

export type Components = typeof popups[number];
