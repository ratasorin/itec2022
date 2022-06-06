import { useEffect } from 'react';
import { useAppDispatch } from '../../hooks/redux.hooks';
import {
  AvailableWidgets,
  AvailableWidgetsStateAndProps,
} from '../store/available';

export const useWidgetActions = <
  T extends AvailableWidgetsStateAndProps[AvailableWidgets]
>(
  widget: AvailableWidgets
) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch({
        type: `${widget}/close`,
      });
    };
  }, []);

  return {
    open: (payload: Omit<T, 'visible'>) => {
      dispatch({
        type: `${widget}/open`,
        payload: {
          ...payload,
          visible: true,
        },
      });
    },
    close: () => {
      dispatch({
        type: `${widget}/close`,
      });
    },
  };
};
