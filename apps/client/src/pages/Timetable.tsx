import { useEffect } from 'react';
import { useLocation } from 'react-router';

const Timetable = () => {
  const id = useLocation().state as number;

  useEffect(() => {
    const getTimetableForSpace = () => {};
  }, []);
  return <div></div>;
};

export default Timetable;
