import { Grid } from '@mui/material';
import { Floor } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import Board from '../components/Board/Board';
import Sidebar from '../components/Sidebar/Sidebar';
import { useFloor } from './slices/floor.slice';

const BuildingMenu = () => {
  const floors = useLocation().state as Floor[];
  const selectedFloorID = useFloor();

  const [floor, setFloor] = useState<Floor | undefined>(
    floors.find((floor) => floor.id === selectedFloorID)
  );

  useEffect(() => {
    setFloor(floors.find((floor) => floor.id === selectedFloorID));
  }, [selectedFloorID, setFloor]);

  return (
    <div className="w-screen h-auto flex flex-row">
      <div className="flex-1">
        <Grid>
          <Sidebar floors={floors}></Sidebar>
        </Grid>
      </div>
      <div className="w-5/6 h-screen flex justify-center items-center bg-amber-300">
        <Board floor={floor} />
      </div>
    </div>
  );
};

export default BuildingMenu;
