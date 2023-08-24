import { FloorDB } from '@shared';
import { SERVER_URL } from '@client/constants/server';
import { useCallback, useEffect, useState } from 'react';

export const getFloors = async (building_id: string) => {
  const response = await fetch(SERVER_URL + `/building/${building_id}/floors`);
  const floors: FloorDB[] = await response.json();

  if (!floors) return [];
  return floors;
};

export const useFloors = (building_id: string) => {
  const [floors, setFloors] = useState<FloorDB[]>([]);

  const fetchFloors = useCallback(async () => {
    const returnedFloors = await getFloors(building_id);
    setFloors(returnedFloors);
  }, [building_id]);

  useEffect(() => {
    fetchFloors();
  }, [fetchFloors]);

  return floors;
};
