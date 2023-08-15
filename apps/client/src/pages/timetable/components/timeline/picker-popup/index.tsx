import { useCallback, useState } from 'react';
import Button from '@mui/material/Button';
import useHandleClickOutside from 'apps/client/src/hooks/click-outside';
import { usePickerPopup } from './picker.slice';
import ReactDOM from 'react-dom';
import { useBookingModal } from '../../booking-modal/booking.slice';
import { useUser } from 'apps/client/src/hooks/user';

const PickerPopup = () => {
  const { close, pickerPopupState } = usePickerPopup();
  const openBookingModal = useBookingModal((state) => state.open);
  const user = useUser();

  const [[left, top], setDimensions] = useState<[number | null, number | null]>(
    [null, null]
  );
  useHandleClickOutside('picker-popup', close);
  const calculateDimensions = useCallback(
    (popup: HTMLDivElement | null) => {
      if (!popup || !pickerPopupState.payload.box)
        return setDimensions([null, null]);
      const dimensions = popup.getBoundingClientRect();

      const { height: popupHeight, width: popupWidth } = dimensions;
      const {
        left: leftBox,
        top: topBox,
        width: widthBox,
      } = pickerPopupState.payload.box;

      let left = leftBox + widthBox / 2 - popupWidth / 2;
      let top = topBox - popupHeight - 10;

      if (left < 0) left = 0.1;
      if (top < 0) top = 0.1;

      setDimensions([left, top]);
    },
    [pickerPopupState]
  );

  if (!pickerPopupState.render) return null;
  return ReactDOM.createPortal(
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
        {pickerPopupState.payload.interval.occupantName
          ? `booked by ${pickerPopupState.payload.interval.occupantName}`
          : 'free'}
      </div>
      <hr />
      <div className="py-1">
        from{' '}
        {new Date(pickerPopupState.payload.interval.start).toLocaleString()}
        <br />
        until {new Date(pickerPopupState.payload.interval.end).toLocaleString()}
      </div>
      {pickerPopupState.payload.interval.occupantName ? null : (
        <Button
          onClick={() => {
            close();

            if (!user) return;
            openBookingModal({
              end: new Date(pickerPopupState.payload.interval.end).getTime(),
              id: pickerPopupState.payload.id,
              occupantName: user.name,
              start: new Date(
                pickerPopupState.payload.interval.start
              ).getTime(),
            });
          }}
        >
          Book Space
        </Button>
      )}
    </div>,
    document.body
  );
};

export default PickerPopup;
