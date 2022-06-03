import { useEffect } from 'react';
import { useSelectWidget } from '../../../utils/select';
import { Details } from './details.slice';
const DetailsPopup = () => {
  const { visible, space } =
    useSelectWidget<Details>('details-popup');

const DetailsPopup = () => {
  const { visible, space } = useSelectWidget<Details>('details-popup');

  useEffect(() => {
    console.log('FROM POPUP, THE SPACES ARE', space);
  }, [space]);

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
    </div>
  );
};

export default DetailsPopup;
