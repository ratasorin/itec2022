import { useAtom } from 'jotai';
import { createPortal } from 'react-dom';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import useHandleClickOutside from '@client/hooks/click-outside';
import { popupStateMachine } from './popups';
import { Box } from '@client/pages/timetable/widgets/picker-popup/picker.slice';

const Tooltip: FC<{ render: boolean; box: Box | null }> = ({ render, box }) => {
  const [, setPopupState] = useAtom(popupStateMachine);

  const closeDeskTooltip = useCallback(() => {
    setPopupState('IDLE');
  }, [setPopupState]);

  const tooltip = useRef<HTMLDivElement | null>(null);
  const [[left, top], setDimensions] = useState<[number | null, number | null]>(
    [null, null]
  );

  useHandleClickOutside('desk-tooltip', closeDeskTooltip, render);

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
    <p
      id="desk-tooltip"
      ref={tooltip}
      className="font-poppins absolute z-50 rounded-md bg-white p-2 text-lg font-black shadow-md"
      style={{
        visibility: render ? 'visible' : 'hidden',
        top: top || 0,
        left: left || 0,
      }}
    >
      This is a tooltip! Cool huh?
    </p>,
    document.body
  );
};

export default Tooltip;
