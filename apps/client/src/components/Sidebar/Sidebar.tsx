import { Floor } from '@prisma/client';
import { FC } from 'react';
import { useUpdateFloor } from '../../pages/slices/floor.slice';

const Sidebar: FC<{
  floors: Floor[];
}> = ({ floors }) => {
  const updateFloor = useUpdateFloor();
  return (
    <div>
      {floors.map(({ id }) => (
        <button
          className=""
          onClick={() => {
            updateFloor(id);
          }}
        >
          SELECT FLOOR {id}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
