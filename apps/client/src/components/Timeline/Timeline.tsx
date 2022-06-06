import { Interval } from '@shared';
import { useEffect } from 'react';
import useDrawTimeline from './draw/timeline';

interface TimelineProps {
  intervals: Interval[];
}

const Timeline = ({ intervals }: TimelineProps) => {
  const drawTimeline = useDrawTimeline(1);

  useEffect(() => {
    if (Array.isArray(intervals) && drawTimeline)
      drawTimeline(intervals, window.innerWidth);
  }, [intervals, drawTimeline]);

  return (
    <div className="flex h-full w-auto flex-col items-start justify-center">
      <div className="text-xl">Check the next available hours</div>
      <div id="timeline"></div>
    </div>
  );
};

export default Timeline;
