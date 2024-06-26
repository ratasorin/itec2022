import { useLocation } from 'react-router';
import { OfficeFromNavigation } from '../building/components/board/hooks/navigate-office-timetable';
import Timeline from './components/timeline';
import BookingModal from './widgets/booking-modal/Booking';
import NotificationPopup from './widgets/notification-popup';
import PickerPopup from './widgets/picker-popup';

const Timetable = () => {
  const { office_id, office_name } = useLocation()
    .state as OfficeFromNavigation;

  return (
    <>
      <BookingModal />
      <NotificationPopup />
      <PickerPopup />
      <div className="font-poppins m-auto flex h-screen w-3/4 flex-col items-center justify-center">
        <div className="text-center text-2xl">
          Welcome to{' '}
          <span className="rounded-md border-2 border-slate-200 bg-slate-100 px-2 py-1">
            {office_name}
          </span>{' '}
        </div>
        <Timeline id={office_id} />
      </div>
    </>
  );
};

export default Timetable;
