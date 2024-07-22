import * as go from 'gojs';

export const FLOOR_CONTAINER_KEY = 'FLOOR_CONTAINER_KEY';
export const FLOOR_CONTAINER_NAME = 'FLOOR_CONTAINER_NAME';
export const FLOOR_CONTAINER_BORDERS_NAME = 'FLOOR_CONTAINER_BORDERS_NAME';
export const DRAGGABLE_DESK_NODE_NAME = 'DRAGGABLE_DESK_NODE';
export const ALLOW_DROP_OUTSIDE_HIGHLIGHTED_AREA = false;
export const CELL_SIZE = new go.Size(20, 20);

export const DEFAULT_PALETTE_CELL_SIZE = new go.Size(60, 60);
export const silverChaliceColorScheme = {
  '50': '#f7f7f7',
  '100': '#ededed',
  '200': '#dfdfdf',
  '300': '#c8c8c8',
  '400': '#b0b0b0',
  '500': '#999999',
  '600': '#888888',
  '700': '#7b7b7b',
  '800': '#676767',
  '900': '#545454',
  '950': '#363636',
};
export const INITIAL_FILL_COLOR = silverChaliceColorScheme[400];
