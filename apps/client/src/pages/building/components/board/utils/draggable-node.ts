import {
  CELL_SIZE,
  DEFAULT_PALETTE_CELL_SIZE,
  DRAGGABLE_DESK_NODE_NAME,
} from '../constants';
import * as go from 'gojs';
import { isDraggableNodeInContainer } from './is-draggable-node-in-container';
import { atom } from 'jotai';
import { Box } from '@client/pages/timetable/widgets/picker-popup/picker.slice';
import { jotaiStore } from '@client/main';
import { computeNodePosition } from './compute-node-position';
import { popupSignal } from '../components/popups';
import { nodeKeyAtom } from '../components/tooltip';
import { darken } from '@mui/material';

export let cursorState: 'not-allowed' | '' = '';
const STROKE_COLOR_DARKEN_COEFFICIENT = 0.25;

const initialFillColor = '#60a5fa';
export const strokeColorBasedOnFill = (fill: string) =>
  darken(fill, STROKE_COLOR_DARKEN_COEFFICIENT);

export const deskRectangleAtom = atom<Box | null>(null);

const $ = go.GraphObject.make;
export const draggableNode = $(
  go.Node,
  'Auto',
  {
    resizable: true,
    name: DRAGGABLE_DESK_NODE_NAME,
    minSize: CELL_SIZE,
    desiredSize: DEFAULT_PALETTE_CELL_SIZE, // initially 1x1 cell
    dragComputation: (node: go.Part, pt: go.Point, gridpt: go.Point) => {
      if (!node.diagram) return gridpt;
      if (node.diagram instanceof go.Palette) return gridpt;

      const isNodeInContainer = isDraggableNodeInContainer(node, node.diagram);

      if (!isNodeInContainer) {
        node.diagram.currentCursor = 'not-allowed';
        cursorState = 'not-allowed';
      } else {
        node.diagram.currentCursor = '';
        cursorState = '';
      }

      return gridpt;
    },

    mouseHold: (e, obj) => {
      const { x, y } = computeNodePosition(obj);
      const node = obj as go.Node;

      jotaiStore.set(nodeKeyAtom, () => node.key);
      jotaiStore.set(popupSignal, () => 'HOLD');
      jotaiStore.set(deskRectangleAtom, () => ({
        top: y || 0,
        left: x || 0,
        width: obj.actualBounds.width,
        height: obj.actualBounds.height,
      }));
    },
  },
  // always save/load the point that is the top-left corner of the node, not the location
  new go.Binding('position', 'pos', go.Point.parse).makeTwoWay(
    go.Point.stringify
  ),
  // this is the primary thing people see
  $(
    go.Shape,
    'RoundedRectangle',
    {
      name: 'SHAPE',
      fill: initialFillColor,
      stroke: strokeColorBasedOnFill(initialFillColor),
      strokeWidth: 4,
      strokeCap: 'round',
      strokeJoin: 'round',
    },
    new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(
      go.Size.stringify
    ),
    new go.Binding('fill', 'fill').makeTwoWay(go.Brush.toString),
    new go.Binding('stroke', 'stroke').makeTwoWay(go.Brush.toString)
  )
); // end Node
