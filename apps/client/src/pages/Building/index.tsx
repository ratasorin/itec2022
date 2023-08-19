import { useLocation } from 'react-router';
import Board from './components/board';
import Sidebar from './components/sidebar';
import { useOffices } from './hooks/offices';
import { useFloors } from './hooks/floors';
import { useSelectedFloor } from './hooks/selected-floor';
import DetailsPopup from './widgets/office-details-popup';

const BuildingMenu = () => {
  const building_id = useLocation().state as string;
  const selectedFloorLevel = useSelectedFloor((state) => state.floor);
  const floors = useFloors(building_id);
  const offices = useOffices(building_id, selectedFloorLevel, undefined);

  return (
    <>
      <DetailsPopup />
      <div className="flex h-auto w-screen flex-row bg-slate-200">
        <Sidebar floors={floors}></Sidebar>
        <div className="flex h-screen flex-1 items-center justify-center bg-white">
          <Board offices={offices} />
        </div>
      </div>
    </>
  );
};

export default BuildingMenu;
