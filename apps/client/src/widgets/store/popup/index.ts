import { combineReducers } from '@reduxjs/toolkit';
import details, {
  detailsPopupName,
} from '../../components/popup/Details/details.slice';
import notification, {
  notificationPopupName,
} from '../../components/popup/Notification/notification.slice';

const popupReducer = combineReducers({
  [detailsPopupName]: details,
  [notificationPopupName]: notification,
});

export default popupReducer;
