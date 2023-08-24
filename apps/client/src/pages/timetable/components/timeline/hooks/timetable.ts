import { OfficeTimeIntervalAPI } from '@shared';
import { SERVER_URL } from '@client/constants/server';
import { useEffect, useState } from 'react';

const useTimetable = (id: string) => {
  const [timetable, setTimetable] = useState<OfficeTimeIntervalAPI[]>([]);

  useEffect(() => {
    if (!id) return;

    const getTimetable = async () => {
      const response = await fetch(SERVER_URL + `booking/timetable/${id}`);
      const timetable: OfficeTimeIntervalAPI[] = await response.json();
      if (!timetable) return;

      setTimetable(timetable);
    };

    getTimetable();
  }, [id]);

  return timetable;
};

export default useTimetable;
