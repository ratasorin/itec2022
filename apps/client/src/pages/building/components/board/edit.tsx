import * as go from 'gojs';
import { useRef } from 'react';
import {
  CELL_SIZE,
  FLOOR_CONTAINER_BORDERS_NAME,
  FLOOR_CONTAINER_KEY,
  FLOOR_CONTAINER_NAME,
} from './constants';
import { cursorState, draggableNode } from './utils/draggable-node';
import Tooltip from './components/tooltip';

const $ = go.GraphObject.make;

const GRID_BACKGROUND = new go.Panel('Grid', {
  gridCellSize: CELL_SIZE,
  background: '#cbd5e1',
}).add(
  new go.Shape('LineH', { stroke: '#64748b' }),
  new go.Shape('LineV', { stroke: '#64748b' })
);

const GRID_FLOOR_CONTAINER = $(
  go.Group,
  {
    name: FLOOR_CONTAINER_NAME,
    resizable: true,
    movable: false,
    padding: 0,
    resizeObjectName: 'GRID',
  },
  // always save/load the point that is the top-left corner of the node, not the location
  new go.Binding('position', 'pos', go.Point.parse).makeTwoWay(
    go.Point.stringify
  ),
  {
    mouseDrop: (e, grp) => {
      const group = grp as go.Group;

      if (!group.diagram?.selection) return;

      const ok = group.addMembers(group.diagram.selection, true);
      const canDrop = group.diagram.currentCursor !== 'not-allowed';
      if (!ok || !canDrop) group.diagram.currentTool.doCancel();
    },
  },

  new go.Panel('Grid', {
    name: 'GRID',
    minSize: new go.Size(CELL_SIZE.width * 4, CELL_SIZE.height * 4),
    gridCellSize: CELL_SIZE,
    background: '#f8fafc',
  })
    .bindTwoWay('desiredSize', 'size', go.Size.parse, go.Size.stringify)
    .add(
      new go.Shape('LineH', { stroke: '#94a3b8' }),
      new go.Shape('LineV', { stroke: '#94a3b8' })
    ),

  new go.Shape('Rectangle', {
    name: FLOOR_CONTAINER_BORDERS_NAME,
    fill: 'transparent',
    stroke: '#94a3b8',
    strokeWidth: 3,
  }).bindTwoWay('desiredSize', 'size', go.Size.parse, go.Size.stringify)
);

const EditBoard = () => {
  const diagram = useRef<go.Diagram | null>(null);

  return (
    <>
      <Tooltip></Tooltip>
      <div className="h-full border-2 border-slate-400">
        <div
          ref={(div) => {
            if (!div || !document) return;

            if (diagram.current) return;

            const DIAGRAM = new go.Diagram('board-plan-diagram', {
              allowZoom: false,
              'undoManager.isEnabled': true,
              'resizingTool.isGridSnapEnabled': true,
              'draggingTool.gridSnapCellSpot': go.Spot.TopLeft,
              'draggingTool.isGridSnapEnabled': true,
              'toolManager.holdDelay': 500,
              padding: 0,
              scrollMargin: 0,
              contentAlignment: go.Spot.Center,
              mouseDrop: (e) => {
                const canDrop = e.diagram.currentCursor !== 'not-allowed';
                if (!canDrop) e.diagram.currentTool.doCancel();
              },
              mouseDragOver: (e) => {
                diagram.current!.currentCursor = cursorState;
              },
            });

            diagram.current = DIAGRAM;
            diagram.current.grid = GRID_BACKGROUND;
            diagram.current.groupTemplate = GRID_FLOOR_CONTAINER;

            // start off with four "racks" that are positioned next to each other
            diagram.current.model = new go.GraphLinksModel([
              {
                key: FLOOR_CONTAINER_KEY,
                isGroup: true,
                pos: '0 0',
                size: '600 600',
              },
            ]);

            diagram.current.commandHandler.memberValidation = (grp, node) => {
              if (grp instanceof go.Group && node instanceof go.Group)
                return false; // cannot add Groups to Groups

              // but dropping a Group onto the background is always OK
              return true;
            };

            diagram.current.nodeTemplate = draggableNode;

            // initialize the first Palette
            const palette = new go.Palette('palette', {
              // share the templates with the main Diagram
              nodeTemplate: diagram.current.nodeTemplate,
              groupTemplate: diagram.current.groupTemplate,
            });

            // specify the contents of the Palette
            palette.model = new go.GraphLinksModel([
              { key: 'default', color: '#a1a1aa' },
            ]);
          }}
          id="board-plan-diagram"
          className="h-full w-full rounded-lg bg-slate-100"
        ></div>
        <div id="palette" style={{ width: 140, height: 340 }}></div>
      </div>
    </>
  );
};

export default EditBoard;
