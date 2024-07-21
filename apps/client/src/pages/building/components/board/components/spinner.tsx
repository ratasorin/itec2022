import { Box } from '@client/pages/timetable/widgets/picker-popup/picker.slice';
import { FC, useEffect, useRef, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { POPUPS_MARGIN } from './popups';

const Spinner: FC<{ render: boolean; box: Box | null }> = ({ render, box }) => {
  const spinner = useRef<HTMLDivElement | null>(null);
  const [[left, top], setDimensions] = useState<[number | null, number | null]>(
    [null, null]
  );

  useEffect(() => {
    if (!spinner.current || !box) return setDimensions([null, null]);
    const dimensions = spinner.current.getBoundingClientRect();

    const { height: tooltipHeight, width: tooltipWidth } = dimensions;
    const { left: leftBox, top: topBox, width: widthBox } = box;

    let left = leftBox + widthBox / 2 - tooltipWidth / 2;
    let top = topBox - tooltipHeight - POPUPS_MARGIN;

    if (left <= 0) left = 0.1;
    if (top <= 0) top = 0.1;

    setDimensions([left, top]);
  }, [box]);

  const [key, setKey] = useState(0);
  useEffect(() => {
    setKey(key + 1);
  }, [render]);
  return (
    <div
      ref={spinner}
      className="absolute z-50"
      style={{
        visibility: render ? 'visible' : 'hidden',
        top: top || 0,
        left: left || 0,
      }}
    >
      <CountdownCircleTimer
        isPlaying={render}
        duration={0.5}
        key={key}
        colors="#60a5fa"
        size={30}
        strokeWidth={3}
      ></CountdownCircleTimer>
    </div>
  );
};

export default Spinner;
