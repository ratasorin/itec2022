import { FloorDB } from '@shared';
import { FC } from 'react';
import { useSelectedFloor } from '../../hooks/selected-floor';

const Sidebar: FC<{
  floors: FloorDB[];
}> = ({ floors }) => {
  const updateFloor = useSelectedFloor((state) => state.changeSelectedFloor);
  const selectedFloor = useSelectedFloor((state) => state.floor);
  return (
    <div className="flex w-auto flex-col justify-center border font-mono font-bold text-slate-800">
      {floors.map((_, level) => (
        <button
          style={
            selectedFloor === level + 1
              ? { borderColor: '#1e293b' }
              : { borderColor: 'gray' }
          }
          className={`w-auto border-r-8 bg-slate-800/10 px-10 py-5 text-2xl transition-all`}
          onClick={() => {
            updateFloor(level + 1);
          }}
        >
          SELECT FLOOR {level + 1}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
