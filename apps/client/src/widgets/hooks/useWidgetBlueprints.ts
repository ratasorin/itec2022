import { useAppSelector } from '../../hooks/redux/redux.hooks';
import { BLUEPRINTS } from '../store/available/blueprints';
import { WIDGETS } from '../store/available/components';

export const useWidgetBlueprint = <R extends BLUEPRINTS>(widget: WIDGETS) => {
  return useAppSelector(({ widgets }) => widgets[widget]) as R;
};
