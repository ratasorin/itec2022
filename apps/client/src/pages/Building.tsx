import { FloorDB, SpaceDB } from '@shared';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import Board from '../components/Floor/Board/Board';
import Sidebar from '../components/Floor/Sidebar/Sidebar';
import { url } from '../constants/server';
import { useFloor } from './slices/floor.slice';

const BuildingMenu = () => {
  const building_id = useLocation().state as string;
  const selectedFloorLevel = useFloor();
  const [floors, setFloors] = useState<FloorDB[]>([]);
  const [floor, setFloor] = useState<FloorDB | undefined>(undefined);

  useEffect(() => {
    const getFloors = async () => {
      const response = await fetch(url(`floor/all/${building_id}`));
      const floors: FloorDB[] = await response.json();
      setFloors(floors);
    };

    if (building_id) getFloors();
  }, [building_id, setFloor]);

  useEffect(() => {
    setFloor(floors.find(({ level }) => level === selectedFloorLevel));
  }, [floors, setFloor, selectedFloorLevel]);

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
