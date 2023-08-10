import { useLocation } from 'react-router';
import { OfficeFromNavigation } from '../../components/floor/board/hooks/navigate-office-timetable';
import Timeline from '../../components/office/timeline';
import { useUser } from '../../hooks/user';

const Timetable = () => {
  const { office_id, office_name } = useLocation()
    .state as OfficeFromNavigation;
  const user = useUser();

  return (
    <div className="m-auto flex h-screen w-3/4 flex-col items-center justify-around">
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
