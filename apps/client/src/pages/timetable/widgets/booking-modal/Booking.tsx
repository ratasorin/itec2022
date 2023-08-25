import { useEffect } from 'react';
import { useBookingModal } from './booking.slice';
import Picker from '../../components/time-picker';
import ReactDOM from 'react-dom';
import useHandleClickOutside from '@client/hooks/click-outside';
import { useLocation } from 'react-router';
import { OfficeFromNavigation } from '../../../building/components/board/hooks/navigate-office-timetable';

const BookingModal = () => {
  const { payload, render } = useBookingModal(
    (state) => state.bookingModalState
  );
  const closeBookingModal = useBookingModal((state) => state.close);
  useHandleClickOutside('booking-modal', closeBookingModal, render, [
    'time-picker',
  ]);
  const { office_name } = useLocation().state as OfficeFromNavigation;

  useEffect(() => {
    return () => {
      closeBookingModal();
    };
  }, []);

  if (!render) return null;
  return ReactDOM.createPortal(
    <div className="absolute top-0 left-0 z-50 h-screen w-screen bg-black/30 font-mono">
      <div
        id="booking-modal"
        className="absolute top-1/2 left-1/2 z-50 translate-x-[-50%] translate-y-[-50%] rounded-md border-2 border-slate-100 bg-white p-10"
      >
        Book{' '}
        <span className="rounded-md border-2 border-slate-200 bg-slate-100 px-2 py-1">
          {office_name}
        </span>
        <Picker id={payload.id} start={payload.start} />
      </div>
    </div>,
    document.getElementById('widgets')!
  );
};

export default BookingModal;
