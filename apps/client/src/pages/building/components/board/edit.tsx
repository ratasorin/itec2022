import * as go from 'gojs';
import { useEffect, useRef, useState } from 'react';
import {
  CELL_SIZE,
  DRAGGABLE_DESK_NODE_NAME,
  FLOOR_CONTAINER_BORDERS_NAME,
  FLOOR_CONTAINER_KEY,
  FLOOR_CONTAINER_NAME,
} from './constants';
import {
  cursorState,
  deskRectangleAtom,
  draggableNode,
  strokeColorBasedOnFill,
} from './utils/draggable-node';
import { jotaiStore } from '@client/main';
import { computeNodePosition } from './utils/compute-node-position';
import Popups, { popupSignal } from './components/popups';
import { atom, useAtom, useAtomValue } from 'jotai';
import { colorAtom, nodeKeyAtom } from './components/tooltip';
import { Resizable } from 're-resizable';
import { Modal } from '@mui/material';
import ModifyShapeModal from './components/modify-shape-modal';

export const modifyShapeModalAtom = atom<{
  render: boolean;
  nodePath: string | undefined;
  color: string | undefined;
}>({
  render: false,
  nodePath: undefined,
  color: undefined,
});

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
    mouseDragEnter: (event, obj) => {
      const target = obj.diagram?.findPartAt(event.documentPoint);
      if (target && target.name === DRAGGABLE_DESK_NODE_NAME)
        jotaiStore.set(popupSignal, () => 'DRAG');
    },
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
  const [modal, setModal] = useAtom(modifyShapeModalAtom);

  const color = useAtomValue(colorAtom);
  const nodeKey = useAtomValue(nodeKeyAtom);

  useEffect(() => {
    if (!diagram.current || !nodeKey) return;

    const data = diagram.current.model.findNodeDataForKey(nodeKey);

    console.log({ data, color });

    if (!data || !color) return;
    diagram.current.model.commit((model) => {
      model.set(data, 'fill', color);
    }, 'Tooltip modify fill color');

    diagram.current.model.commit((model) => {
      model.set(data, 'stroke', strokeColorBasedOnFill(color));
    }, 'Tooltip modify stroke color');
  }, [color, nodeKey]);

  return (
    <>
      <Modal
        open={modal.render}
        className="flex items-center justify-center"
        onClose={() =>
          setModal({ render: false, nodePath: undefined, color: undefined })
        }
      >
        <ModifyShapeModal nodePath={modal.nodePath} color={modal.color} />
      </Modal>
      <Popups />
      <div className="flex h-full flex-row-reverse rounded-lg border-4 border-slate-400">
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

            diagram.current.doMouseDown = function () {
              if (!diagram.current) return;
              const e = diagram.current.lastInput;

              const target = diagram.current.findPartAt(e.documentPoint);
              if (target && target.name === DRAGGABLE_DESK_NODE_NAME) {
                jotaiStore.set(popupSignal, () => 'MOUSE-DOWN');
                const { x, y } = computeNodePosition(target);

                jotaiStore.set(deskRectangleAtom, () => ({
                  top: y || 0,
                  left: x || 0,
                  width: target.actualBounds.width,
                  height: target.actualBounds.height,
                }));
              }

              go.Diagram.prototype.doMouseDown.call(this);
            };

            diagram.current.doMouseUp = function () {
              if (!diagram.current) return;

              const e = diagram.current.lastInput;
              const target = diagram.current.findPartAt(e.documentPoint);
              if (target && target.name === DRAGGABLE_DESK_NODE_NAME)
                jotaiStore.set(popupSignal, () => 'MOUSE-UP');

              go.Diagram.prototype.doMouseUp.call(this);
            };

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
              padding: new go.Margin(100, 20, 20, 20),
            });

            // specify the contents of the Palette
            palette.model = new go.GraphLinksModel([
              { key: 'default', color: '#a1a1aa' },
            ]);
          }}
          id="board-plan-diagram"
          className="h-full w-full rounded-lg bg-slate-100"
        ></div>
        <Resizable
          defaultSize={{ width: 140 }}
          className="relative z-20 h-full border-r-4 border-slate-400"
          enable={{ right: true }}
        >
          <div id="palette" className="h-full"></div>
        </Resizable>
      </div>
    </>
  );
};

export default EditBoard;
