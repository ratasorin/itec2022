import { useEffect, useMemo, useState } from 'react';
import { Button } from '@mui/material';
import { useDetailsPopup } from './details.slice';
import useDimensions from '@client/hooks/dimensions';
import ReactDOM from 'react-dom';
import useHandleClickOutside from '@client/hooks/click-outside';

const widgetsContainer = document.getElementById('widgets');
if (!widgetsContainer) throw new Error('Widget container missing');

const DetailsPopup = () => {
  const closeDetailsPopup = useDetailsPopup((state) => state.close);
  const { payload, render } = useDetailsPopup(
    (state) => state.detailsPopupState
  );

  useHandleClickOutside('details-popup', closeDetailsPopup, render);

  const [popup, setPopup] = useState<HTMLDivElement | null>(null);

  const dimensions = useDimensions(popup);
  const { left, top } = useMemo(() => {
    if (!dimensions || !payload.box) return { left: null, top: null };
    const {
      left: containerLeft,
      top: containerTop,
      width: containerWidth,
    } = payload.box;
    const { width: popupWidth, height: popupHeight } = dimensions;

    return {
      left: containerLeft + containerWidth / 2 - popupWidth / 2,
      top: containerTop - popupHeight - 20,
    };
  }, [dimensions, payload]);

  useEffect(() => {
    return () => closeDetailsPopup();
  }, []);

  if (!render) return null;
  return ReactDOM.createPortal(
    <div
      id="details-popup"
      ref={setPopup}
      style={{
        visibility: top && left ? 'visible' : 'hidden',
        top: top || 0,
        left: left || 0,
      }}
      className="font-poppins absolute z-50 flex flex-col items-start justify-start rounded-md bg-white p-6 align-middle shadow-md"
    >
      <span className="pb-3">
        Booked by {payload.occupantName || ''}, until{' '}
        {new Date(payload.booked_until || '').toLocaleTimeString()}
      </span>
      <Button
        variant="outlined"
        className="font-poppins w-auto border-black text-black hover:border-black hover:bg-black/5"
      >
        BOOK NEXT
      </Button>
    </div>,
    widgetsContainer
  );
};

export default DetailsPopup;
