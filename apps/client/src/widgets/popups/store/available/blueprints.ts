import { DetailsPopupBlueprint } from '../../components/Details/details.slice';
import { NotificationPopupBlueprint } from '../../components/Notification/notification.slice';
import { PickerPopupBlueprint } from '../../components/Picker/picker.slice';

export type Blueprints =
  | NotificationPopupBlueprint
  | DetailsPopupBlueprint
  | PickerPopupBlueprint;
