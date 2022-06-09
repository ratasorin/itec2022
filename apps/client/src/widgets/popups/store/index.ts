import details, { detailsPopupName } from '../components/Details/details.slice';
import notification, {
  notificationPopupName,
} from '../components/Notification/notification.slice';
import picker, { pickerPopupName } from '../components/Picker/picker.slice';

const popupReducers = {
  [detailsPopupName]: details,
  [notificationPopupName]: notification,
  [pickerPopupName]: picker,
};

export default popupReducers;
