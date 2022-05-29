import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { url } from '../constants/server';
import { add } from 'date-fns';
import Picker from '../components/Picker/Picker';

const Timetable = () => {
  const id = useLocation().state as number;
  const [timetable, setTimetable] = useState<[Date, Date][]>();
  const [timeframes, setTimeframes] = useState<[Date, Date][]>();
  useEffect(() => {
    const end = add(new Date(), { days: 1 });
    console.log(JSON.stringify({ end }));

    const getTimetableForSpace = async () => {
      const response = await fetch(url(`booking/availability/${id}`), {
        method: 'POST',
        body: JSON.stringify({ end }),
      });
      const timetable = (await response.json()) as [Date, Date][];
      if (!timetable) return;
      setTimetable(timetable);
    };

    const getAvailableTimeframesForSpace = async () => {
      const response = await fetch(url(`booking/available/${id} `), {
        method: 'POST',
        body: JSON.stringify({ end }),
      });
      const timeframes = (await response.json()) as [Date, Date][];
      if (!timeframes) return;
      setTimeframes(timeframes);
    };

    getTimetableForSpace();
    getAvailableTimeframesForSpace();
    console.log({ id });
  }, []);
  return (
    <>
      <div>
        THE TIMEFRAMES ARE
        {timeframes?.map(([begin, end]) => (
          <li>
            THE AREA IS FREE FROM {new Date(begin).toLocaleTimeString()} TO{' '}
            {new Date(end).toLocaleTimeString()}
          </li>
        ))}
      </div>
      ;
      <div>
        THE TIMETABLE IS
        {timetable?.map(([begin, end], index) => (
          <li>
            THE AREA IS {index % 2 ? 'OCCUPIED' : 'FREE'} FROM{' '}
            {new Date(begin).toLocaleTimeString()} TO{' '}
            {new Date(end).toLocaleTimeString()}
          </li>
        ))}
      </div>
      );
      <Picker id={id} />
    </>
  );
};

export default Timetable;
