import { CELL_SIZE } from '../constants';
import * as go from 'gojs';
import { isDraggableNodeInContainer } from './is-draggable-node-in-container';

export let cursorState: 'not-allowed' | '' = '';

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

      console.log({ isNodeInContainer });

      if (!isNodeInContainer) {
        node.diagram.currentCursor = 'not-allowed';
        cursorState = 'not-allowed';
      } else {
        node.diagram.currentCursor = '';
        cursorState = '';
      }

      return gridpt;
    },
  },
  // always save/load the point that is the top-left corner of the node, not the location
  new go.Binding('position', 'pos', go.Point.parse).makeTwoWay(
    go.Point.stringify
  ),
  // this is the primary thing people see
  $(
    go.Shape,
    'Rectangle',
    {
      name: 'SHAPE',
      fill: 'white',
      minSize: CELL_SIZE,
      desiredSize: CELL_SIZE, // initially 1x1 cell
    },
    new go.Binding('fill', 'color'),
    new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(
      go.Size.stringify
    )
  ),
  // with the textual key in the middle
  $(
    go.TextBlock,
    { alignment: go.Spot.Center, font: 'bold 16px sans-serif' },
    new go.Binding('text', 'key')
  )
); // end Node
