import { useLocation } from 'react-router';
import Timeline from '../components/Office/Timeline/Timeline';

const Timetable = () => {
  const id = useLocation().state as string;

  return (
    <div className="flex h-full w-full flex-col items-center justify-around p-10">
      <div className="text-2xl">Office {id} 👨‍💼</div>
      <Timeline id={id} />
    </div>
  );
};

export default Timetable;
