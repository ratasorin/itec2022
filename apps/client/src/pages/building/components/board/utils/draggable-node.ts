import { CELL_SIZE, DRAGGABLE_DESK_NODE_NAME } from '../constants';
import * as go from 'gojs';
import { isDraggableNodeInContainer } from './is-draggable-node-in-container';
import { atom } from 'jotai';
import { Box } from '@client/pages/timetable/widgets/picker-popup/picker.slice';
import { jotaiStore } from '@client/main';
import { computeNodePosition } from './compute-node-position';
import { popupSignal } from '../components/popups';

export let cursorState: 'not-allowed' | '' = '';

export const deskRectangleAtom = atom<Box | null>(null);

const $ = go.GraphObject.make;
export const draggableNode = $(
  go.Node,
  'Auto',
  {
    resizable: true,
    resizeObjectName: 'SHAPE',
    name: DRAGGABLE_DESK_NODE_NAME,

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
      fill: '#60a5fa',
      stroke: '#3b82f6',
      strokeWidth: 3,
      strokeCap: 'round',
      strokeJoin: 'round',
      minSize: CELL_SIZE,
      desiredSize: CELL_SIZE, // initially 1x1 cell
    },
    new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(
      go.Size.stringify
    )
  )
); // end Node
