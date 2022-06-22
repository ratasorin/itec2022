import { SpacesOnFloor } from '@shared';
import { url } from '../../../constants/server';
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
  const response = await fetch(url(`floor/${building_id}/${level}`));
  const offices: SpacesOnFloor[] = await response.json();
  if (!offices) return [];
  return offices;
};

const getOfficeByFloorID = async (floor_id: string) => {
  const response = await fetch(url(`floor/${floor_id}/spaces`));
  const offices: SpacesOnFloor[] = await response.json();
  if (!offices) return [];
  return offices;
};

export const useOffices = (params: FetchOfficesBy) => {
  const [offices, setOffices] = useState<SpacesOnFloor[]>([]);

  const fetchOffices = useCallback(
    async ({ building_id, floor_id, level }: FetchOfficesBy) => {
      let offices: SpacesOnFloor[] = [];
      if (building_id && level)
        offices = await getOfficesByBuildingAndLevel(building_id, level);
      if (floor_id) offices = await getOfficeByFloorID(floor_id);
      setOffices(offices);
    },
    []
  );
  useEffect(() => {
    fetchOffices(params);
  }, [params, fetchOffices]);

  return offices;
};
