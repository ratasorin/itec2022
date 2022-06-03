import { useAppDispatch } from '../../hooks/redux.hooks';
import {
  AvailableWidgets,
  AvailableWidgetsStateAndProps,
} from '../store/available';

export const useOpenWidget = <
  T extends AvailableWidgetsStateAndProps[AvailableWidgets]
>(
  widget: AvailableWidgets
) => {
  const dispatch = useAppDispatch();
  return (payload: Omit<T, 'visible'>) => {
    dispatch({
      type: `${widget}/open`,
      payload: {
        ...payload,
        visible: true,
      },
    });
  };
};
