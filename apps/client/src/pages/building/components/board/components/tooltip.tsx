import { atom, useAtom, useSetAtom } from 'jotai';
import { createPortal } from 'react-dom';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import useHandleClickOutside from '@client/hooks/click-outside';
import { popupStateMachine } from './popups';
import { Box } from '@client/pages/timetable/widgets/picker-popup/picker.slice';
import { TwitterPicker } from 'react-color';
import {
  Button,
  ClickAwayListener,
  Divider,
  IconButton,
  TextField,
} from '@mui/material';
import { modifyShapeModalAtom } from '../edit';
import { INITIAL_FILL_COLOR } from '../constants';
import { LuTextCursorInput } from 'react-icons/lu';
import { Tooltip as TooltipMUI } from '@mui/material';
import { LuShapes } from 'react-icons/lu';
import { strokeColorBasedOnFill } from '../utils/draggable-node';

export const colorAtom = atom<string | null>(INITIAL_FILL_COLOR);
export const nodeKeyAtom = atom<go.Key | null>(null);

const Tooltip: FC<{
  render: boolean;
  box: Box | null;
  nodePath: string | undefined;
}> = ({ render, box, nodePath }) => {
  const [, setPopupState] = useAtom(popupStateMachine);
  const [color, setColor] = useAtom(colorAtom);

  const closeDeskTooltip = useCallback(() => {
    setPopupState('IDLE');
    setColor(null);
  }, [setPopupState]);

  const tooltip = useRef<HTMLDivElement | null>(null);
  const [[left, top], setDimensions] = useState<[number | null, number | null]>(
    [null, null]
  );

  useHandleClickOutside('desk-tooltip', closeDeskTooltip, render);
  const setModalOpen = useSetAtom(modifyShapeModalAtom);

  const [openColorPicker, setOpenColorPicker] = useState(false);

  useEffect(() => {
    if (!tooltip.current || !box) return setDimensions([null, null]);
    const dimensions = tooltip.current.getBoundingClientRect();

    const { height: tooltipHeight, width: tooltipWidth } = dimensions;
    const {
      left: leftBox,
      top: topBox,
      width: widthBox,
      height: heightBox,
    } = box;

    let left = leftBox + widthBox / 2 - tooltipWidth / 2;
    let top = topBox - tooltipHeight - 10;

    if (top <= 0 || left <= 0) {
      left = leftBox + widthBox + 10;
      top = topBox + heightBox / 2 - tooltipHeight / 2;
    }
    if (leftBox + widthBox + 10 + tooltipWidth > window.innerWidth) {
      left = leftBox - tooltipWidth - 10;
      top = topBox + heightBox / 2 - tooltipHeight / 2;
    }

    setDimensions([left, top]);
  }, [box]);

  return createPortal(
    <div
      id="desk-tooltip"
      ref={tooltip}
      className="font-poppins absolute z-50 flex flex-row items-center rounded-md border border-slate-300 bg-white p-1 text-lg font-black shadow-md"
      style={{
        visibility: render ? 'visible' : 'hidden',
        top: top || 0,
        left: left || 0,
      }}
    >
      <TooltipMUI title="EDIT THE NAME">
        <IconButton className="rounded-lg p-2 text-gray-800">
          <LuTextCursorInput />
        </IconButton>
      </TooltipMUI>

      <Divider
        orientation="vertical"
        variant="middle"
        flexItem
        className="mx-1"
      />

      <TooltipMUI title="CUSTOMIZE SHAPE">
        <IconButton className="rounded-lg p-2 text-gray-800">
          <LuShapes
            onClick={() =>
              setModalOpen({
                render: true,
                color: color || undefined,
                nodePath,
              })
            }
          />
        </IconButton>
      </TooltipMUI>

      <Divider
        orientation="vertical"
        variant="middle"
        flexItem
        className="mx-1"
      />

      <ClickAwayListener
        onClickAway={() => {
          setOpenColorPicker(false);
        }}
      >
        <div>
          <TooltipMUI
            PopperProps={{
              disablePortal: true,
            }}
            onClose={() => {
              setOpenColorPicker(false);
            }}
            componentsProps={{
              popper: { className: 'm-0' },
              tooltip: { className: 'm-0 !mt-1 bg-transparent' },
            }}
            open={openColorPicker}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            title={
              <TwitterPicker
                triangle="hide"
                onChange={(color) => {
                  console.log({ hex: color.hex });
                  setColor(color.hex);
                }}
              />
            }
          >
            <Button
              onClick={() => setOpenColorPicker(true)}
              className="font-poppins flex items-center rounded-lg border-black p-2 font-semibold capitalize text-black hover:border-black hover:bg-black/5"
            >
              <span className="mr-2 text-base">Color</span>
              <div
                className="h-6 w-6 rounded-md border-2"
                style={{
                  backgroundColor: color || INITIAL_FILL_COLOR,
                  borderColor: strokeColorBasedOnFill(
                    color || INITIAL_FILL_COLOR
                  ),
                }}
              ></div>
            </Button>
          </TooltipMUI>
        </div>
      </ClickAwayListener>
    </div>,
    document.body
  );
};

export default Tooltip;
