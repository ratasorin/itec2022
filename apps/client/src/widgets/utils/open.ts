import { store } from '../../config/store';
import {
  AvailableWidgets,
  AvailableWidgetsStateAndProps,
} from '../store/available';

export const useOpenWidget = <
  T extends AvailableWidgetsStateAndProps[AvailableWidgets]
>(
  widget: AvailableWidgets
) => {
  return (payload: Omit<T, 'visible'>) => {
    store.dispatch({
      type: `${widget}/open`,
      payload: {
        ...payload,
        visible: true,
      },
    });
  };
};
