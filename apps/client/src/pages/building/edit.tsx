import { useParams } from 'react-router';
import Sidebar from './components/sidebar';
import { useSelectedFloor } from './hooks/selected-floor';
import { useFloors } from './hooks/floors';
import { useOffices } from './hooks/offices';
import Board from './components/board';

const EditBuilding = () => {
  const building_id = useParams()['id'] || '';
  const selectedFloorLevel = useSelectedFloor((state) => state.floor);
  const floors = useFloors(building_id);
  const offices = useOffices(building_id, selectedFloorLevel, undefined);

  return <Board edit offices={offices} />;
};

export default EditBuilding;
