import { useLocation } from 'react-router';
import Board from './components/board';
import Sidebar from './components/sidebar';
import { useOffices } from './hooks/offices';
import { useFloors } from './hooks/floors';
import { useSelectedFloor } from './hooks/selected-floor';
import DetailsPopup from './widgets/office-details-popup';
import { BuildingStateNavigation } from '../home';

const BuildingMenu = () => {
  const { building_id, buildingName } = useLocation()
    .state as BuildingStateNavigation;
  const selectedFloorLevel = useSelectedFloor((state) => state.floor);
  const floors = useFloors(building_id);
  const offices = useOffices(building_id, selectedFloorLevel, undefined);

  return (
    <>
      <DetailsPopup />
      <div className="font-poppins m-auto flex h-screen w-8/12 max-w-lg flex-col justify-center text-xl">
        <div className="mx-auto mb-10">
          Welcome to{' '}
          <span className="rounded-md border-2 border-slate-200 bg-slate-100 px-2 py-1">
            {buildingName}
          </span>{' '}
          office-building
        </div>
        <Sidebar floors={floors}></Sidebar>
        <div className="flex items-center justify-center bg-white">
          <Board offices={offices} />
        </div>
      </div>
    </>
  );
};

export default BuildingMenu;
