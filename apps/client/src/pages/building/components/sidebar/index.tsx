import { FloorDB } from '@shared';
import { FC } from 'react';
import { useSelectedFloor } from '../../hooks/selected-floor';
import { Button } from '@mui/material';

const Sidebar: FC<{
  floors: FloorDB[];
}> = ({ floors }) => {
  const updateFloor = useSelectedFloor((state) => state.changeSelectedFloor);
  const selectedFloor = useSelectedFloor((state) => state.floor);
  return (
    <div className="mb-3 flex h-14 w-full flex-row items-center rounded-lg bg-zinc-100 px-4 py-2">
      {floors.map((_, floorIndex) => (
        <Button
          style={
            selectedFloor === floorIndex + 1
              ? {
                  color: 'black',
                  borderColor: '#52525b',
                }
              : { color: '#71717a', borderColor: '#d4d4d8' }
          }
          className="font-poppins mr-4 min-h-full rounded-md border-2 border-solid bg-white px-3 py-1 shadow-md hover:bg-white hover:shadow-sm"
          TouchRippleProps={{
            style: { opacity: 0.2 },
          }}
          onClick={() => {
            updateFloor(floorIndex + 1);
          }}
        >
          Floor {floorIndex + 1}
        </Button>
      ))}
    </div>
  );
};

export default Sidebar;
