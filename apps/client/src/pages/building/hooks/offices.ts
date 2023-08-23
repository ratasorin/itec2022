import { OfficesOnFloor } from '@shared';
import { SERVER_URL } from '../../../constants/server';
import { useCallback, useEffect, useState } from 'react';

export type FetchOfficesBy = {
  floor_id?: string;
  building_id?: string;
  level?: number | string;
};

const getOfficesByBuildingAndLevel = async (
  building_id: string,
  level: number | string
) => {
  const response = await fetch(SERVER_URL + `/floor/${building_id}/${level}`);
  const offices: OfficesOnFloor[] = await response.json();
  if (!offices) return [];
  return offices;
};

const getOfficeByFloorID = async (floor_id: string) => {
  const response = await fetch(SERVER_URL + `floor/${floor_id}/office`);
  const offices: OfficesOnFloor[] = await response.json();
  if (!offices) return [];
  return offices;
};

export const useOffices = (
  building_id?: string,
  level?: string | number,
  floor_id?: string
) => {
  const [offices, setOffices] = useState<OfficesOnFloor[]>([]);

  const fetchOffices = useCallback(async () => {
    let offices: OfficesOnFloor[] = [];
    if (building_id && level)
      offices = await getOfficesByBuildingAndLevel(building_id, level);
    if (floor_id) offices = await getOfficeByFloorID(floor_id);
    setOffices(offices);
  }, [building_id, level, floor_id]);

  useEffect(() => {
    fetchOffices();
  }, [fetchOffices]);

  return offices;
};
