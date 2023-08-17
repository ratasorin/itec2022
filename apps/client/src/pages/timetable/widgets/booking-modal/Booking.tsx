import { useEffect, useRef, useState } from 'react';
import { useBookingModal } from './booking.slice';
import Picker from '../../components/time-picker';
import ReactDOM from 'react-dom';
import useHandleClickOutside from 'apps/client/src/hooks/click-outside';

const BookingModal = () => {
  const { payload, render } = useBookingModal(
    (state) => state.bookingModalState
  );
  const closeBookingModal = useBookingModal((state) => state.close);
  useHandleClickOutside(
    'booking-modal',
    closeBookingModal,
    ['time-picker'],
    render
  );

  useEffect(() => {
    return () => {
      closeBookingModal();
    };
  }, []);

  if (!render) return null;
  return ReactDOM.createPortal(
    <div className="absolute top-0 left-0 h-screen w-screen bg-black bg-opacity-50">
      <div
        id="booking-modal"
        className="absolute top-2/4 left-2/4 z-50 translate-x-[-50%] translate-y-[-50%] bg-white p-10"
      >
        <Picker id={payload.id} start={payload.start} />
      </div>
    </div>,
    document.getElementById('widgets')!
  );
};

export default BookingModal;
