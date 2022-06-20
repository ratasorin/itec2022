import useOnClickOutside from '../../../../hooks/useOnClickOutside';
import { useCallback, useState } from 'react';
import { useWidgetBlueprint } from '../../../hooks/useWidgetBlueprints';
import { PickerPopupBlueprint } from './picker.slice';
import { useWidgetActions } from '../../../hooks/useWidgetActions';
import Button from '@mui/material/Button';
import { BookingActionBlueprint } from '../../../modals/components/Booking/booking.slice';

const PickerPopup = () => {
  const { payload, specification } =
    useWidgetBlueprint<PickerPopupBlueprint>('picker-popup');
  const { close } = useWidgetActions('picker-popup');
  const { open } = useWidgetActions<BookingActionBlueprint>('booking-modal');

  const [[left, top], setDimensions] = useState<[number | null, number | null]>(
    [null, null]
  );
  const [popup, setPopup] = useState<HTMLDivElement | null>(null);

  useOnClickOutside(popup, close);

  const dimensions = useDimensions(popup);
  const { left, top } = useMemo(() => {
    if (!dimensions || !specification.box) return { left: null, top: null };

    (popup: HTMLDivElement | null) => {
      if (!popup || !specification.box) return setDimensions([null, null]);
      const dimensions = popup.getBoundingClientRect();
      console.log({ box: specification.box });
      const { height: popupHeight, width: popupWidth } = dimensions;
      const { left: leftBox, top: topBox, width: widthBox } = specification.box;

      let left = leftBox + widthBox / 2 - popupWidth / 2;
      let top = topBox - popupHeight - 10;

      if (left < 0) left = 0.1;
      if (top < 0) top = 0.1;

      setDimensions([left, top]);
    },
    [specification]
  );

  if (!specification.render) return null;
  return (
    <div
      id="picker-popup"
      ref={calculateDimensions}
      style={{
        visibility: left && top ? 'visible' : 'hidden',
        top: top || 0,
        left: left || 0,
      }}
      className="absolute z-50 items-center bg-white p-5 shadow-lg"
    >
      <div className="py-1 font-bold">
        The office is{' '}
        {payload.interval.occupantName
          ? `booked by ${payload.interval.occupantName}`
          : 'free'}
      </div>
      <hr />
      <div className="py-1">
        from {payload.interval.start}
        <br />
        until {payload.interval.end}
      </div>
      {payload.interval.occupantName ? null : (
        <Button
          onClick={() => {
            close();
            open({
              payload: {
                end: payload.interval.end,
                occupantName: payload.interval.occupantName,
                start: payload.interval.start,
                id: payload.id,
              },
              specification: {},
            });
          }}
        >
          Book Space
        </Button>
      )}
    </div>
  );
};

export default PickerPopup;
