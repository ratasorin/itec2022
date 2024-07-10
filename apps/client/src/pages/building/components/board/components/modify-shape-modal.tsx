import { Resizable } from 're-resizable';
import { strokeColorBasedOnFill } from '../utils/draggable-node';
import { FC, useState } from 'react';
import { Button, CircularProgress, TextField } from '@mui/material';
import * as paper from 'paper';
import { atom, useAtom } from 'jotai';
import { jotaiStore } from '@client/main';
import { FaEraser } from 'react-icons/fa';
import svg from '!!svg-url-loader?noquotes!@client/assets/eraser-cursor.raw.svg';
import { nodeKeyAtom } from './tooltip';
import * as go from 'gojs';

const CELL_SIZE = 20;

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
const eraserActiveAtom = atom(false);

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

  const rect = new paper.Path.Rectangle(
    new paper.Point(x, y),
    new paper.Size(CELL_SIZE, CELL_SIZE)
  );

  if (!path) return;

  const eraserActive = jotaiStore.get(eraserActiveAtom);
  console.log({ eraserActive });

  let prevPath = path;

  if (eraserActive) {
    path = path.subtract(rect);
  } else {
    path = path.unite(rect);
  }

  prevPath.remove();
  rect.remove();
}

console.log({ url: `url(${decodeURIComponent(svg)})` });
const DEFAULT_CANVAS_SIZE = { width: 420, height: 420 };
const ModifyShapeModal: FC<{
  nodePath: string | undefined;
  color: string;
}> = ({ nodePath, color }) => {
  const [canvasSize, setCanvasSize] = useState(DEFAULT_CANVAS_SIZE);
  const [showLoader, setShowLoader] = useState(false);
  const [hasPlacedListeners, setHasPlacedListeners] = useState(false);
  const [eraserActive, setEraserActive] = useAtom(eraserActiveAtom);
  const [nodeKey] = useAtom(nodeKeyAtom);

  return (
    <div className="font-poppins flex flex-col items-center rounded-lg bg-white p-6 shadow-md">
      <h1 className="mb-3 text-lg font-bold">Prototype New Shape</h1>
      <div className="mb-4">
        Editing Shape with Id:{' '}
        <span className="rounded-md border-2 border-slate-500 bg-slate-100 px-2 py-1 font-black text-slate-800">
          {nodeKey}
        </span>
      </div>

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
                style={{
                  cursor: eraserActive
                    ? `url("${svg}") 20 20, auto`
                    : 'crosshair',
                }}
                width={canvasSize.width}
                height={canvasSize.height}
                ref={(canvas) => {
                  console.log({ color });
                  if (!canvas || hasPlacedListeners || !nodePath || !color)
                    return;

                  setHasPlacedListeners(true);
                  paper.setup(canvas);

                  path = new paper.Path();
                  path.strokeWidth = 4;
                  path.fillColor = new paper.Color(color);
                  path.strokeColor = new paper.Color(
                    strokeColorBasedOnFill(color)
                  );

                  const importedPath = document.createElementNS(
                    'http://www.w3.org/2000/svg',
                    'path'
                  );
                  importedPath.setAttribute('d', nodePath);
                  const p = path.importSVG(importedPath, {
                    insert: false,
                  }) as paper.Path;

                  let prevPath = path;
                  path = path.unite(p);
                  prevPath.remove();
                  p.remove();

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
            </>
          )}
        </Resizable>
      </div>
      <div className="mt-3 flex w-full justify-between">
        {eraserActive ? (
          <Button
            onClick={() => {
              setEraserActive(false);
            }}
            variant="outlined"
            className="font-poppins border-2 border-black font-semibold text-black hover:border-2 hover:border-black hover:bg-black/5"
          >
            ERASER
            <FaEraser className="ml-2 text-base" />
          </Button>
        ) : (
          <Button
            onClick={() => {
              setEraserActive(true);
            }}
            variant="outlined"
            className="font-poppins border-2 border-gray-500 font-semibold text-gray-500 hover:border-2 hover:border-gray-500 hover:bg-gray-500/5"
          >
            ERASER
            <FaEraser className="ml-2 text-base" />
          </Button>
        )}

        <Button
          onClick={() => {
            if (!path) return;

            const pathSVG = path.exportSVG() as SVGPathElement;
            const bounds = path.strokeBounds;
            const d = pathSVG.getAttribute('d');

            console.log({ bounds });
            if (!d) return;

            const diagram = go.Diagram.fromDiv('board-plan-diagram');
            if (!diagram || !nodeKey) return;

            const width = bounds.width - 2 * 4;
            const height = bounds.height - 2 * 4;

            const node = diagram.findNodeForKey(nodeKey);
            diagram.model.setDataProperty(
              node?.data,
              'geometryString',
              'F ' + d
            );

            diagram.model.setDataProperty(
              node?.data,
              'size',
              `${width + 4}, ${height + 4}`
            );
          }}
          variant="outlined"
          className="font-poppins border-2 border-green-500 font-semibold text-green-800 hover:border-2 hover:border-green-500 hover:bg-green-500/5"
        >
          SAVE CHANGES
        </Button>
      </div>
    </div>
  );
};

export default ModifyShapeModal;
