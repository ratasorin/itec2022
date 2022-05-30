import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { url } from '../constants/server';
import { add } from 'date-fns';
import Picker from '../components/Picker/Picker';

const Timetable = () => {
  const id = useLocation().state as number;
  const [timetable, setTimetable] = useState<[string, string][]>();
  const [timeframes, setTimeframes] = useState<[string, string][]>();
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
      console.log(timetable);
      setTimetable(timetable);
    };

    const getAvailableTimeframes = async () => {
      const response = await fetch(url(`booking/available/${id} `), {
        method: 'POST',
        body: JSON.stringify({ end }),
        headers: [['Content-Type', 'application/json']],
      });

      const timeframes = await response.json();

      if (!timeframes) return;

      setTimeframes(timeframes);
    };

    getAvailableTimeframes();
    getTimetable();
  }, [id]);
  return (
    <>
      <div>
        THE TIMEFRAMES ARE
        {timeframes?.map(([begin, end]) => (
          <li>
            THE AREA IS FREE FROM{' '}
            {new Date(begin)
              .toLocaleDateString()
              .concat(' ')
              .concat(new Date(begin).toLocaleTimeString())}{' '}
            TO{' '}
            {new Date(end)
              .toLocaleDateString()
              .concat(' ')
              .concat(new Date(end).toLocaleTimeString())}
          </li>
        ))}
      </div>
      <div>
        THE TIMETABLE IS{' '}
        {timetable?.map(([begin, end], index) => (
          <li>
            THE AREA IS {index % 2 ? 'OCCUPIED' : 'FREE'} FROM{' '}
            {new Date(begin)
              .toLocaleDateString()
              .concat(' ')
              .concat(new Date(begin).toLocaleTimeString())}{' '}
            TO{' '}
            {new Date(end)
              .toLocaleDateString()
              .concat(' ')
              .concat(new Date(end).toLocaleTimeString())}
          </li>
        ))}
      </div>
      <Picker id={id} />
    </>
  );
};

export default Timetable;
