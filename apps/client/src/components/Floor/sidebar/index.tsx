import { FloorDB } from '@shared';
import { FC } from 'react';
import { useFloor, useUpdateFloor } from '../../../pages/slices/floor.slice';

const Sidebar: FC<{
  floors: FloorDB[];
}> = ({ floors }) => {
  const updateFloor = useUpdateFloor();
  const selectedFloor = useFloor();
  return (
    <div className="flex w-auto flex-col justify-center font-mono font-bold text-white">
      {floors.map((_, level) => (
        <button
          className={`w-auto border-l-8 transition-all ${
            selectedFloor === level ? 'border-white' : 'border-gray-400'
          } px-10 py-5 text-2xl`}
          onClick={() => {
            updateFloor(level);
          }}
        >
          SELECT FLOOR {level}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
