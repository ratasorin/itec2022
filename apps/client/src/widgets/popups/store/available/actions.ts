import { DetailsActionBlueprint } from '../../components/Details/details.slice';
import { NotificationActionBlueprint } from '../../components/Notification/notification.slice';
import { PickerActionBlueprint } from '../../components/Picker/picker.slice';

export type Actions =
  | NotificationActionBlueprint
  | PickerActionBlueprint
  | DetailsActionBlueprint;
