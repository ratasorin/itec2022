import { useLocation } from 'react-router';
import { OfficeFromNavigation } from '../building/components/board/hooks/navigate-office-timetable';
import Timeline from './components/timeline';
import { useUser } from '../../hooks/user';
import BookingModal from './components/booking-modal/Booking';

const Timetable = () => {
  const { office_id, office_name } = useLocation()
    .state as OfficeFromNavigation;
  const user = useUser();

  return (
    <>
      <BookingModal />
      <div className="m-auto flex h-screen w-3/4 flex-col items-center justify-around">
        <div className="text-center text-2xl">
          Welcome to {office_name}
          <br />
          👨‍💼 {user?.name || ''}
        </div>
        <Timeline id={office_id} />
      </div>
    </>
  );
};

export default Timetable;
