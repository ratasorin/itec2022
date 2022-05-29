import { Floor } from '@prisma/client';
import { useLocation } from 'react-router';
import Board from '../components/Board/Board';

const CampusMenu = () => {
  const floors = useLocation().state as Floor[];
  console.log({ floors });
  return (
    <div className="w-screen h-auto">
      {floors.map((floor) => (
        <div className="w-full h-72 border-b-4">
          <Board floor={floor} />
        </div>
      ))}
    </div>
  );
};

export default CampusMenu;
