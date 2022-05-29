import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { url } from '../constants/server';

const Timetable = () => {
  const id = Number(useLocation().key) as number;
  const [timetable, setTimetable] = useState<[Date, Date][]>();
  const [timeframes, setTimeframes] = useState<[Date, Date][]>();
  useEffect(() => {
    const getTimetableForSpace = async () => {
      const response = await fetch(url(`booking/availability/${id}`));
      const timetable = (await response.json()) as [Date, Date][];
      if (!timetable) return;
      setTimetable(timetable);
    };

    const getAvailableTimeframesForSpace = async () => {
      const response = await fetch(url(`booking/available/${id}`));
      const timeframes = (await response.json()) as [Date, Date][];
      if (!timeframes) return;
      setTimeframes(timeframes);
    };

    // getTimetableForSpace();
    // getAvailableTimeframesForSpace();
    console.log({ id });
  }, []);
  return (
    <>
      <div>THE TIMEFRAMES ARE{JSON.stringify(timeframes)}</div>;
      <div>THE TIMETABLE IS{JSON.stringify(timetable)}</div>;
    </>
  );
};

export default Timetable;
