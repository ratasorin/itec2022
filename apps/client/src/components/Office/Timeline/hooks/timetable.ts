import { OfficeTimeIntervalDB } from '@shared';
import { url } from '../../../../constants/server';
import { useEffect, useState } from 'react';

const useTimetable = (id: string) => {
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

  return timetable;
};

export default useTimetable;
