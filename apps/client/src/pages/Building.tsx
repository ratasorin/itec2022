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
  }, [selectedFloorID, setFloor, floors]);

  return (
    <div className="flex h-auto w-screen flex-row bg-slate-500">
      <Sidebar floors={floors}></Sidebar>
      <div className="flex h-screen flex-1 items-center justify-center bg-amber-300">
        <Board floor={floor} />
      </div>
    </div>
  );
};

export default BuildingMenu;
