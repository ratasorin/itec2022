import { useEffect } from 'react';
import { useSelectWidget } from '../../../utils/select';
import { Details } from './details.slice';

const DetailsPopup = () => {
  const { visible, space } = useSelectWidget<Details>('details-popup');

  useEffect(() => {
    console.log('FROM POPUP, THE SPACES ARE', space);
  }, [space]);

  if (!visible) return null;
  return <div>Details</div>;
};

export default DetailsPopup;
