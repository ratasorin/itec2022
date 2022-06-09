import { useMemo, useState } from 'react';
import { useWidgetBlueprint } from '../../../hooks/useWidgetBlueprints';
import { DetailsPopupBlueprint } from './details.slice';
import { Button } from '@mui/material';
import useDimensions from '../../../../hooks/useDimensions';

const DetailsPopup = () => {
  const { payload, specification } =
    useWidgetBlueprint<DetailsPopupBlueprint>('details-popup');

  const [popup, setPopup] = useState<HTMLDivElement | null>(null);
  const dimensions = useDimensions(popup);
  const { left, top } = useMemo(() => {
    if (!dimensions || !specification.box) return { left: null, top: null };
    const {
      left: containerLeft,
      top: containerTop,
      width: containerWidth,
    } = specification.box;
    const { width: popupWidth, height: popupHeight } = dimensions;

    return {
      left: containerLeft + containerWidth / 2 - popupWidth / 2,
      top: containerTop - popupHeight - 20,
    };
  }, [dimensions, specification]);

  if (!specification.render) return null;
  return (
    <div
      ref={setPopup}
      style={{
        visibility: top && left ? 'visible' : 'hidden',
        top: top || 0,
        left: left || 0,
      }}
      className="absolute z-50 flex flex-col items-start justify-start rounded-md bg-white p-6 align-middle shadow-md"
    >
      <span className="pb-3">
        Booked by {payload.name || ''}, until{' '}
        {new Date(payload.book_until || '').toLocaleTimeString()}
      </span>
      <Button variant="outlined" className="w-auto">
        BOOK NEXT
      </Button>
    </div>
  );
};

export default DetailsPopup;
