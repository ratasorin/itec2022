import { atom, useAtom, useSetAtom } from 'jotai';
import { createPortal } from 'react-dom';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import useHandleClickOutside from '@client/hooks/click-outside';
import { popupStateMachine } from './popups';
import { Box } from '@client/pages/timetable/widgets/picker-popup/picker.slice';
import { TwitterPicker } from 'react-color';
import { Button } from '@mui/material';
import { modifyShapeModalAtom } from '../edit';
import { INITIAL_FILL_COLOR } from '../constants';

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

  useEffect(() => {
    if (!tooltip.current || !box) return setDimensions([null, null]);
    const dimensions = tooltip.current.getBoundingClientRect();

    const { height: tooltipHeight, width: tooltipWidth } = dimensions;
    const { left: leftBox, top: topBox, width: widthBox } = box;

    let left = leftBox + widthBox / 2 - tooltipWidth / 2;
    let top = topBox - tooltipHeight - 10;

    if (left <= 0) left = 0.1;
    if (top <= 0) top = 0.1;

    setDimensions([left, top]);
  }, [box]);

  return createPortal(
    <div
      id="desk-tooltip"
      ref={tooltip}
      className="font-poppins absolute z-50 flex flex-col items-center rounded-md bg-white p-4 text-lg font-black shadow-md"
      style={{
        visibility: render ? 'visible' : 'hidden',
        top: top || 0,
        left: left || 0,
      }}
    >
      <Button
        variant="outlined"
        className="font-poppins row-start-2 mb-3 border-black text-black hover:border-black hover:bg-black/5"
        onClick={() => {
          console.log({ color });
          setModalOpen({
            render: true,
            nodePath,
            color: color ? color : undefined,
          });
        }}
      >
        RESHAPE
      </Button>
      <TwitterPicker
        triangle="hide"
        onChange={(color) => {
          console.log({ hex: color.hex });
          setColor(color.hex);
        }}
      />
    </div>,
    document.body
  );
};

export default Tooltip;
