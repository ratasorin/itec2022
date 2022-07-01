import { useLocation } from 'react-router';
import { OfficeFromNavigation } from '../../components/Floor/Board/hooks/navigate-office-timetable';
import Timeline from '../../components/Office/Timeline/Timeline';
import { useUser } from '../../hooks/user';

const Timetable = () => {
  const { office_id, office_name } = useLocation()
    .state as OfficeFromNavigation;
  const user = useUser();

  return (
    <div className="flex h-full w-full flex-col items-center justify-around p-10">
      <div className="text-center text-2xl">
        Welcome to {office_name}
        <br />
        👨‍💼 {user?.name || ''}
      </div>
      <Timeline id={office_id} />
    </div>
  );
};

export default Timetable;
