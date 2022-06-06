import { useAppSelector } from '../../hooks/redux.hooks';
import {
  AvailableWidgets,
  AvailableWidgetsStateAndProps,
} from '../store/available';

export const useSelectWidget = <
  Returns extends AvailableWidgetsStateAndProps[AvailableWidgets]
>(
  widget: AvailableWidgets
) => {
  return useAppSelector(({ widgets }) => widgets.popup[widget]) as Returns;
};
