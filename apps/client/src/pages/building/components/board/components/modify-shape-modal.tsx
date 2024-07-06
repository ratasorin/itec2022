import { Resizable } from 're-resizable';
import {
  INITIAL_FILL_COLOR,
  strokeColorBasedOnFill,
} from '../utils/draggable-node';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';
import * as paper from 'paper';

const CELL_SIZE = 30;

const drawGrid = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  ctx.strokeStyle = 'lightgrey';
  ctx.beginPath();
  for (let x = 0; x <= width; x += CELL_SIZE) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = 0; y <= height; y += CELL_SIZE) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();
};

type CanvasUserAction = 'mouse-down' | 'mouse-up' | 'mouse-out' | 'mouse-move';
let flag = false,
  prevX = 0,
  currX = 0,
  prevY = 0,
  currY = 0,
  dot_flag = false;

let color = INITIAL_FILL_COLOR,
  y = 2;

let rect: paper.Path.Rectangle | null = null;

const findXY = (
  action: CanvasUserAction,
  e: MouseEvent,
  canvas: HTMLCanvasElement
) => {
  const { top: canvasTop, left: canvasLeft } = canvas.getBoundingClientRect();

  if (action == 'mouse-down') {
    prevX = currX;
    prevY = currY;
    currX = e.clientX - canvasLeft;
    currY = e.clientY - canvasTop;

    flag = true;
    dot_flag = true;
    if (dot_flag) {
      draw();
    }
  }
  if (action == 'mouse-up' || action == 'mouse-out') {
    flag = false;
  }
  if (action == 'mouse-move') {
    if (flag) {
      prevX = currX;
      prevY = currY;
      currX = e.clientX - canvasLeft;
      currY = e.clientY - canvasTop;
      draw();
    }
  }
};

let path: null | paper.PathItem = null;

let prevClosestCell: { x: number; y: number } | undefined = undefined;
function draw() {
  const closestCell = {
    x: Math.floor(currX / CELL_SIZE),
    y: Math.floor(currY / CELL_SIZE),
  };

  if (
    prevClosestCell &&
    closestCell.x === prevClosestCell.x &&
    prevClosestCell.y === closestCell.y
  ) {
    prevClosestCell = closestCell;
    return;
  }

  prevClosestCell = closestCell;

  const x = closestCell.x * CELL_SIZE;
  const y = closestCell.y * CELL_SIZE;

  rect = new paper.Path.Rectangle(
    new paper.Point(x, y),
    new paper.Size(CELL_SIZE, CELL_SIZE)
  );

  if (!path) return;

  path = path.unite(rect);
  console.log(path.pathData);
}

const DEFAULT_CANVAS_SIZE = { width: 420, height: 420 };

let hasPlacedEventListeners = false;

const ModifyShapeModal = () => {
  const [canvasSize, setCanvasSize] = useState(DEFAULT_CANVAS_SIZE);
  const [showLoader, setShowLoader] = useState(false);
  return (
    <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-md">
      <h1 className="font-poppins mb-3 text-lg font-bold">
        Prototype New Shape
      </h1>
      <div className="overflow-hidden rounded-md border-4 border-slate-300">
        <Resizable
          className="relative flex items-center justify-center"
          defaultSize={DEFAULT_CANVAS_SIZE}
          onResizeStart={() => {
            setShowLoader(true);
          }}
          onResizeStop={(_, __, ___, delta) => {
            console.log({ delta });
            setShowLoader(false);
            setCanvasSize({
              height: canvasSize.height + delta.height,
              width: canvasSize.width + delta.width,
            });
          }}
          minHeight={420}
          minWidth={420}
          grid={[CELL_SIZE, CELL_SIZE]}
        >
          {showLoader ? (
            <CircularProgress className="text-slate-300" />
          ) : (
            <>
              <canvas
                className="absolute top-0 left-0 h-full w-full"
                width={canvasSize.width}
                height={canvasSize.height}
                ref={(canvas) => {
                  if (!canvas) return;
                  const ctx = canvas.getContext('2d');
                  if (!ctx) return;
                  console.log(canvas.width, canvas.height);
                  drawGrid(ctx, canvas.width, canvas.height);
                }}
              ></canvas>
              <canvas
                className="absolute top-0 left-0 z-10 h-full w-full"
                width={canvasSize.width}
                height={canvasSize.height}
                ref={(canvas) => {
                  if (!canvas || hasPlacedEventListeners) return;

                  hasPlacedEventListeners = true;
                  paper.setup(canvas);

                  path = new paper.Path();

                  path.fillColor = new paper.Color('black');
                  path.strokeColor = new paper.Color('red');

                  canvas.addEventListener(
                    'mousemove',
                    function (e) {
                      findXY('mouse-move', e, canvas);
                    },
                    true
                  );
                  canvas.addEventListener(
                    'mousedown',
                    function (e) {
                      findXY('mouse-down', e, canvas);
                    },
                    true
                  );
                  canvas.addEventListener(
                    'mouseup',
                    function (e) {
                      findXY('mouse-up', e, canvas);
                    },
                    true
                  );
                  canvas.addEventListener(
                    'mouseout',
                    function (e) {
                      findXY('mouse-out', e, canvas);
                    },
                    true
                  );
                }}
              ></canvas>

              {/* <svg className="absolute top-0 left-0 z-10 h-full w-full">
                <path d="M150,180v-30h30v30z" fill="black" stroke="red"></path>
              </svg> */}
            </>
          )}
        </Resizable>
      </div>
    </div>
  );
};

export default ModifyShapeModal;
