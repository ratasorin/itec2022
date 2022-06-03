import { useCallback, useState } from 'react';
import { useSelectWidget } from '../../../utils/select';
import { Details } from './details.slice';
import { Button } from '@mui/material';
const DetailsPopup = () => {
  const { visible, space, boundingBox } =
    useSelectWidget<Details>('details-popup');
  const [{ x, y }, setCoordinates] = useState({ x: 0, y: 0 });
  const getPopupPosition = useCallback(
    (popup: HTMLDivElement) => {
      if (!popup) return setCoordinates({ x: 0, y: 0 });
      const {
        left: containerLeft,
        top: containerTop,
        width: containerWidth,
      } = boundingBox;
      const { width: popupWidth, height: popupHeight } =
        popup.getBoundingClientRect();

      const coordinates = {
        x: containerLeft + containerWidth / 2 - popupWidth / 2,
        y: containerTop - popupHeight - 20,
      };

      console.log({ coordinates });
      return setCoordinates(coordinates);
    },
    [boundingBox]
  );

  if (!visible) return null;
  return (
    <div
      ref={getPopupPosition}
      style={{
        top: y,
        left: x,
      }}
      className="absolute z-50 flex flex-col items-start justify-start rounded-md bg-white p-6 align-middle shadow-md"
    >
      <span className="pb-3">
        Booked by {space.name}, until{' '}
        {new Date(space.book_until || '').toLocaleTimeString()}
      </span>
      <Button variant="outlined" className="w-auto">
        BOOK NEXT
      </Button>
    </div>
  );
};

export default DetailsPopup;
