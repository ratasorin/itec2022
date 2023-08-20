import { useCallback, useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import { usePickerPopup } from './picker.slice';
import ReactDOM from 'react-dom';
import { useBookingModal } from '../booking-modal/booking.slice';
import { useUser } from 'apps/client/src/hooks/user';
import useHandleClickOutside from 'apps/client/src/hooks/click-outside';

const PickerPopup = () => {
  const closePickerPopup = usePickerPopup((state) => state.close);
  const { payload, render } = usePickerPopup((state) => state.pickerPopupState);

  const openBookingModal = useBookingModal((state) => state.open);
  const user = useUser();
  const popup = useRef<HTMLDivElement | null>(null);
  const [[left, top], setDimensions] = useState<[number | null, number | null]>(
    [null, null]
  );

  useHandleClickOutside('picker-popup', closePickerPopup, render);

  useEffect(() => {
    if (!popup.current || !payload.box) return setDimensions([null, null]);
    const dimensions = popup.current.getBoundingClientRect();

    const { height: popupHeight, width: popupWidth } = dimensions;
    const { left: leftBox, top: topBox, width: widthBox } = payload.box;

    let left = leftBox + widthBox / 2 - popupWidth / 2;
    let top = topBox - popupHeight - 10;

    if (left <= 0) left = 0.1;
    if (top <= 0) top = 0.1;

    setDimensions([left, top]);
  }, [payload]);

  useEffect(() => {
    return () => {
      closePickerPopup();
    };
  }, []);

  if (!render) return null;
  return ReactDOM.createPortal(
    <div
      id="picker-popup"
      ref={popup}
      style={{
        visibility: left && top ? 'visible' : 'hidden',
        top: top || 0,
        left: left || 0,
      }}
      className="absolute z-50 items-center rounded-md border-2 border-slate-100 bg-white p-5 font-mono shadow-lg"
    >
      <div className="py-1 font-bold">
        The office is{' '}
        {payload.interval.occupantName
          ? `booked by ${payload.interval.occupantName}`
          : 'free'}
      </div>
      <hr />
      <div className="py-1">
        from:
        <br />
        <span className="ml-2">
          {new Date(payload.interval.start).toLocaleString()}
        </span>
        <br />
        <div className="border-1 w-full border-black"></div>
        until:
        <br />{' '}
        <span className="ml-2">
          {new Date(payload.interval.end).toLocaleString()}
        </span>
      </div>
      {payload.interval.occupantName ? null : (
        <Button
          className="row-start-2 border-black font-mono text-black hover:border-black hover:bg-black/5"
          onClick={() => {
            if (!user) return;
            openBookingModal({
              end: new Date(payload.interval.end).getTime(),
              id: payload.id,
              occupantName: user.name,
              start: new Date(payload.interval.start).getTime(),
            });
          }}
        >
          Book Space
        </Button>
      )}
    </div>,
    document.getElementById('widgets')!
  );
};

export default PickerPopup;
