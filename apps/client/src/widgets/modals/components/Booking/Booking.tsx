import useOnClickOutside from '../../../../hooks/click-outside';
import PickerComponent from '../../../../components/Office/TimePicker/TimePicker';
import { useWidgetBlueprint } from '../../../hooks/useWidgetBlueprints';
import { BookingModalBlueprint } from './booking.slice';
import { useState } from 'react';
import { useWidgetActions } from '../../../hooks/useWidgetActions';

const BookingModal = () => {
  const { payload, specification } =
    useWidgetBlueprint<BookingModalBlueprint>('booking-modal');

  const { close } = useWidgetActions('booking-modal');
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useOnClickOutside(ref, close);

  if (!specification.render) return null;
  return (
    <div className="absolute top-0 left-0 h-screen w-screen bg-black bg-opacity-50">
      <div
        ref={setRef}
        className="absolute top-2/4 left-2/4 z-50 translate-x-[-50%] translate-y-[-50%] bg-white p-10"
      >
        <PickerComponent id={payload.id} start={payload.start} />
      </div>
    </div>
  );
};

export default BookingModal;
