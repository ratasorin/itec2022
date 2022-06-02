import {
  detailsPopupState,
  detailsPopupName,
} from '../../components/popup/Details/details.slice';
import {
  notificationPopupState,
  notificationPopupName,
} from '../../components/popup/Notification/notification.slice';
const popups = [detailsPopupName, notificationPopupName] as const;
const popupsState = [
  {
    [detailsPopupName]: detailsPopupState,
    [notificationPopupName]: notificationPopupState,
  },
] as const;

export type AvailablePopups = typeof popups[number];
export type AvailablePopupStateAndProps = typeof popupsState[number];
