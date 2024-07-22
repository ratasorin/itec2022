import { DRAGGABLE_DESK_NODE_NAME, INITIAL_FILL_COLOR } from '../constants';
import * as go from 'gojs';
import { isDraggableNodeInContainer } from './is-draggable-node-in-container';
import { atom } from 'jotai';
import { Box } from '@client/pages/timetable/widgets/picker-popup/picker.slice';
import { jotaiStore } from '@client/main';
import { computeNodePosition } from './compute-node-position';
import { popupSignal } from '../components/popups';
import { colorAtom, nodeKeyAtom } from '../components/tooltip';
import { darken } from '@mui/material';

const hexToRGB = (hex: string, opacity: number = 1) => {
  const h = hex.replace('#', '');

  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export let cursorState: 'not-allowed' | '' = '';
const STROKE_COLOR_DARKEN_COEFFICIENT = 0.25;

export const strokeColorBasedOnFill = (fill: string) =>
  darken(fill, STROKE_COLOR_DARKEN_COEFFICIENT);

export const deskRectangleAtom = atom<Box | null>(null);
export const nodePathAtom = atom<string | undefined>(undefined);
export const nodeDataAtom = atom<any>(undefined);

const createResizeHandle = (alignment: go.Spot, cursor: string) =>
  $(go.Shape, 'Circle', {
    alignment,
    cursor,
    desiredSize: new go.Size(10, 10),
    fill: '#00BFFF',
    stroke: null,
  });

export const DESK_SHAPE_NAME = 'DESK_SHAPE_NAME';

const $ = go.GraphObject.make;
export const draggableNode = $(
  go.Node,
  'Spot',
  {
    name: DRAGGABLE_DESK_NODE_NAME,
    resizable: true,
    rotatable: true,
    selectable: true,
    resizeObjectName: DESK_SHAPE_NAME,
    selectionObjectName: DESK_SHAPE_NAME,
    locationSpot: go.Spot.Center,
    selectionAdornmentTemplate: $(
      go.Adornment,
      'Auto',
      $(go.Shape, {
        fill: null,
        stroke: '#00BFFF',
        strokeWidth: 3,
        strokeDashArray: [4, 6],
        strokeJoin: 'round',
        strokeCap: 'round',
      }),

      $(go.Placeholder, { margin: 5 })
    ),
    resizeAdornmentTemplate: $(
      go.Adornment,
      'Auto',
      $(go.Shape, { fill: null, stroke: null }),
      createResizeHandle(go.Spot.TopLeft, 'nw-resize'),
      createResizeHandle(go.Spot.Top, 'n-resize'),
      createResizeHandle(go.Spot.TopRight, 'ne-resize'),
      createResizeHandle(go.Spot.Left, 'w-resize'),
      createResizeHandle(go.Spot.Right, 'e-resize'),
      createResizeHandle(go.Spot.BottomLeft, 'se-resize'),
      createResizeHandle(go.Spot.Bottom, 's-resize'),
      createResizeHandle(go.Spot.BottomRight, 'sw-resize'),

      $(go.Placeholder, { margin: 10 })
    ),
    rotateAdornmentTemplate: $(
      go.Adornment,
      'Auto',
      {
        locationSpot: new go.Spot(0.5, 0.5, -10, 0),
        cursor: 'grab',
      },
      $(go.Shape, {
        figure: 'Circle',
        fill: hexToRGB('#00BFFF', 0.8),
        strokeWidth: 0,
        width: 30,
        height: 30,
      }),
      $(
        go.Panel,
        $(go.Shape, {
          geometryString:
            'F M0,94.02c.56-4.02,1.03-8.05,1.69-12.04,2.03-12.31,6.23-23.89,12.41-34.7,4.24-7.41,12.99-9.82,20.43-5.94,7.07,3.68,10.04,12.42,6.32,19.93-3.82,7.7-7.33,15.47-8.91,23.98-4.09,22.03.17,42.29,13.19,60.57,9.9,13.9,23.16,23.38,39.34,28.62,11.96,3.87,24.28,4.89,36.63,2.44,30.45-6.03,51.1-23.88,60.73-53.27,7.62-23.24,3.74-45.47-9.63-66.38-.42.84-.73,1.42-1,2.01-1.64,3.57-3.12,7.22-4.95,10.69-1.96,3.71-5.54,4.76-9.07,2.46-2.35-1.54-4.56-3.58-6.22-5.84-10.84-14.7-21.53-29.51-32.23-44.31-.94-1.3-1.8-2.71-2.36-4.2-2.18-5.73.36-10.62,6.4-11.68,5.73-1,11.55-1.51,17.34-2.13,12.85-1.39,25.7-2.77,38.56-4.01,2.83-.27,5.81-.35,8.57.21,4.95,1.01,7.21,5.16,5.47,9.93-1.65,4.54-3.68,8.95-5.71,13.34-.77,1.66-.76,2.71.58,4.18,13.75,15.02,23,32.5,26.29,52.58,7.24,44.13-7.2,80.06-42.57,107.33-13.93,10.74-29.98,17.16-47.4,19.5-34.11,4.59-64.21-4.57-89.54-27.96C14.58,161.06,3.57,138.17.52,111.45.35,110,.17,108.55,0,107.1c0-4.36,0-8.71,0-13.07Z',
          strokeWidth: 0,
          fill: 'white',
          width: 20,
          height: 20,
        })
      )
    ),
    dragComputation: (node: go.Part, pt: go.Point, gridpt: go.Point) => {
      if (!node.diagram) return gridpt;
      if (node.diagram instanceof go.Palette) return gridpt;

      console.log({ el: node.elements.first()! });
      const isNodeInContainer = isDraggableNodeInContainer(
        node.elements.first()!,
        node.diagram
      );

      if (!isNodeInContainer) {
        node.diagram.currentCursor = 'not-allowed';
        cursorState = 'not-allowed';
      } else {
        node.diagram.currentCursor = '';
        cursorState = '';
      }

      return gridpt;
    },

    mouseEnter: (ev, obj) => {
      const node = obj as go.Node;
      const { x, y } = computeNodePosition(obj);

      console.log(node.key);
      if (node.key?.toString().includes('palette')) return;

      jotaiStore.set(popupSignal, () => 'MOUSE-IN');
      jotaiStore.set(nodeDataAtom, () => node.data);
      jotaiStore.set(deskRectangleAtom, () => ({
        top: y || 0,
        left: x || 0,
        width: obj.actualBounds.width,
        height: obj.actualBounds.height,
      }));
    },

    mouseLeave: () => {
      jotaiStore.set(popupSignal, () => 'MOUSE-OUT');
    },

    mouseHold: (e, obj) => {
      const { x, y } = computeNodePosition(obj);
      const node = obj as go.Node;

      const shape = node.elements.first() as go.Shape;
      const geometry = shape.geometry;

      if (!geometry) {
        console.error('GEOMETRY OBJECT NOT FOUND ON NODE: ', node.key);
        return;
      }

      jotaiStore.set(popupSignal, () => 'HOLD');
      jotaiStore.set(
        colorAtom,
        () => shape.fill?.toString() || INITIAL_FILL_COLOR
      );
      jotaiStore.set(nodeKeyAtom, () => node.key);
      jotaiStore.set(nodePathAtom, () => go.Geometry.stringify(geometry));
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
    'Rectangle',
    {
      name: DESK_SHAPE_NAME,
      fill: INITIAL_FILL_COLOR,
      stroke: strokeColorBasedOnFill(INITIAL_FILL_COLOR),
      minSize: new go.Size(20, 20),
      strokeWidth: 4,
      strokeCap: 'round',
      strokeJoin: 'round',
    },
    new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(
      go.Size.stringify
    ),
    new go.Binding('fill', 'fill').makeTwoWay(go.Brush.toString),
    new go.Binding('stroke', 'stroke').makeTwoWay(go.Brush.toString),
    new go.Binding('geometryString', 'geometryString').makeTwoWay(
      go.Geometry.parse
    )
  )
); // end Node
