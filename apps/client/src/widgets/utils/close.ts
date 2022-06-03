import { useAppDispatch } from '../../hooks/redux.hooks';
import { AvailableWidgets } from '../store/available';

export const useCloseWidget = (widget: AvailableWidgets) => {
  const dispatch = useAppDispatch();
  return () => {
    dispatch({
      type: `${widget}/close`,
    });
  };
};
