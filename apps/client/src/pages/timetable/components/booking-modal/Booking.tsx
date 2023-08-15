import useHandleClickOutside from '../../../../hooks/click-outside';
import { useState } from 'react';
import { useBookingModal } from './booking.slice';
import Picker from '../time-picker';
import ReactDOM from 'react-dom';

const BookingModal = () => {
  const { payload, render } = useBookingModal(
    (state) => state.bookingModalState
  );

  const close = useBookingModal((state) => state.close);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useHandleClickOutside(ref, close, ['time-picker']);

  if (!render) return null;
  return ReactDOM.createPortal(
    <div className="absolute top-0 left-0 h-screen w-screen bg-black bg-opacity-50">
      <div
        ref={setRef}
        className="absolute top-2/4 left-2/4 z-50 translate-x-[-50%] translate-y-[-50%] bg-white p-10"
      >
        <Picker id={payload.id} start={payload.start} />
      </div>
    </div>,
    document.body
  );
};

export default BookingModal;
