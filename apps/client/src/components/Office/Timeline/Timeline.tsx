import { OfficeTimeIntervalDB } from '@shared';
import { useEffect, useState } from 'react';
import { url } from '../../../constants/server';
import useDrawTimeline from './draw/timeline';

interface TimelineProps {
  id: number;
}

const Timeline = ({ id }: TimelineProps) => {
  const drawTimeline = useDrawTimeline(id);
  const [timetable, setTimetable] = useState<OfficeTimeIntervalDB[]>([]);

  useEffect(() => {
    if (!id) return;

    const getTimetable = async () => {
      const response = await fetch(url(`booking/timetable/${id}`), {
        method: 'GET',
        headers: [['Content-Type', 'application/json']],
      });
      const timetable: OfficeTimeIntervalDB[] = await response.json();
      if (!timetable) return;

      setTimetable(timetable);
    };

    getTimetable();
  }, [id]);

  useEffect(() => {
    if (Array.isArray(timetable) && drawTimeline)
      drawTimeline(timetable, window.innerWidth);
  }, [timetable, drawTimeline]);

  return (
    <div className="flex h-full w-auto flex-col items-start justify-center">
      <div className="text-xl">Check the next available hours</div>
      <div id="timeline"></div>
    </div>
  );
};

export default Timeline;
