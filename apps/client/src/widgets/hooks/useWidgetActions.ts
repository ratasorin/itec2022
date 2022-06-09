import { useEffect } from 'react';
import { useAppDispatch } from '../../hooks/redux/redux.hooks';
import { ACTIONS } from '../store/available/actions';
import { WIDGETS } from '../store/available/components';

export const useWidgetActions = <T extends ACTIONS>(widget: WIDGETS) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch({
        type: `${widget}/close`,
      });
    };
  }, [dispatch, widget]);

  return {
    open: (payload: T) => {
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
