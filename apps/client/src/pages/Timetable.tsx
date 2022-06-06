import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { url } from '../constants/server';
import { add } from 'date-fns';
import Picker from '../components/Picker/Picker';
import Timeline from '../components/Timeline/Timeline';
import { Interval } from '@shared';

const Timetable = () => {
  const id = useLocation().state as number;
  const [timetable, setTimetable] = useState<Interval[]>([]);
  useEffect(() => {
    if (!id) return;

    const end = add(new Date(), { days: 1 });

    const getTimetable = async () => {
      const response = await fetch(url(`booking/timetable/${id}`), {
        method: 'POST',
        body: JSON.stringify({ end }),
        headers: [['Content-Type', 'application/json']],
      });
      const timetable = await response.json();
      if (!timetable) return;
      setTimetable(timetable);
    };

    getTimetable();
  }, [id]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-around p-10">
      <div className="text-2xl">Office {id} 👨‍💼</div>
      <Timeline intervals={timetable} />
      <Picker id={id} />
    </div>
  );
};

export default Timetable;
