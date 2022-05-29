import { Floor } from '@prisma/client';
import { useLocation } from 'react-router';
import Board from '../components/Board/Board';

const CampusMenu = () => {
  const floors = useLocation().state as Floor[];
  return (
    <div className="w-screen h-auto">
      {floors.map((floor) => (
        <div className="w-screen">
          <Board floor={floor} />
        </div>
      ))}
    </div>
  );
};

export default CampusMenu;
