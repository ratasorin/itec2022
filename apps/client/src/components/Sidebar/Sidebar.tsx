import { Floor } from '@prisma/client';
import { FC } from 'react';
import { useFloor, useUpdateFloor } from '../../pages/slices/floor.slice';

const Sidebar: FC<{
  floors: Floor[];
}> = ({ floors }) => {
  const updateFloor = useUpdateFloor();
  const selectedFloor = useFloor();
  return (
    <div className="flex w-auto flex-col py-5 font-mono font-bold text-white ">
      {floors.map(({ id }) => (
        <button
          className="w-auto border-l-8 px-10 py-5 text-2xl "
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
