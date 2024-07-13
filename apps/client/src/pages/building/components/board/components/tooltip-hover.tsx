import { useAtom } from 'jotai';
import { FC, useEffect, useRef, useState } from 'react';
import { nodeDataAtom } from '../utils/draggable-node';
import { Box } from '@client/pages/timetable/widgets/picker-popup/picker.slice';
import { createPortal } from 'react-dom';
import { nodeKeyAtom } from './tooltip';

const TooltipHover: FC<{ box: Box | null; render: boolean }> = ({
  box,
  render,
}) => {
  const [[left, top], setDimensions] = useState<[number | null, number | null]>(
    [null, null]
  );
  const tooltip = useRef<HTMLDivElement>(null);
  const [nodeData] = useAtom(nodeDataAtom);

  useEffect(() => {
    console.log(nodeData);
  }, nodeData);

  useEffect(() => {
    if (!tooltip.current || !box) return setDimensions([null, null]);
    const dimensions = tooltip.current.getBoundingClientRect();
    console.log(dimensions, box);

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
      if (leftBox + widthBox + 10 + tooltipWidth > window.innerWidth) {
        left = leftBox - tooltipWidth - 10;
        top = topBox + heightBox / 2 - tooltipHeight / 2;
      } else {
        left = leftBox + widthBox + 10;
        top = topBox + heightBox / 2 - tooltipHeight / 2;
      }
    }

    setDimensions([left, top]);
  }, [box, nodeData]);

  return createPortal(
    <div
      ref={tooltip}
      className="font-poppins absolute z-[100] rounded-md border-2 border-slate-300 bg-white px-2 py-1 text-base font-bold shadow-md"
      style={{
        visibility: render ? 'visible' : 'hidden',
        left: left || 0,
        top: top || 0,
      }}
    >
      {nodeData
        ? nodeData.order && !nodeData.name
          ? `Office ${nodeData.order}`
          : nodeData.name
          ? nodeData.name
          : ''
        : ''}
    </div>,
    document.body
  );
};

export default TooltipHover;
