import { CELL_SIZE } from '../constants';
import * as go from 'gojs';
import { isDraggableNodeInContainer } from './is-draggable-node-in-container';
import { atom } from 'jotai';
import { Box } from '@client/pages/timetable/widgets/picker-popup/picker.slice';
import { jotaiStore } from '@client/main';

export let cursorState: 'not-allowed' | '' = '';

export const deskRectangleAtom = atom<(Box & { render: boolean }) | null>(null);

const $ = go.GraphObject.make;
export const draggableNode = $(
  go.Node,
  'Auto',
  {
    resizable: true,
    resizeObjectName: 'SHAPE',
    name: 'DRAGGABLE-NODE',
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
      const diagram = obj.diagram;
      if (!diagram) return;

      const nodeLocation_doc = obj.part?.location; // in document coordinates
      if (!nodeLocation_doc) return;
      const nodeLocation_viewport =
        diagram.transformDocToView(nodeLocation_doc); // in viewport coordinates

      if (!diagram.div) return;

      const left = diagram.div.offsetLeft;
      const top = diagram.div.offsetTop;

      jotaiStore.set(deskRectangleAtom, () => ({
        top: nodeLocation_viewport.y + top,
        left: nodeLocation_viewport.x + left,
        width: obj.actualBounds.width,
        height: obj.actualBounds.height,
        render: true,
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
