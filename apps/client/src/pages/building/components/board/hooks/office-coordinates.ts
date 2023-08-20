import { OfficesOnFloor } from '@shared';
import { useMemo } from 'react';

export const useOfficeCoordinates = (offices: OfficesOnFloor[]) => {
  const { x, y } = useMemo(
    () =>
      offices.reduce(
        (prev, curr) => {
          if (curr.x + 1 > prev.x)
            return {
              x: curr.x + 1,
              y: curr.y + 1,
            };
          if (curr.x + 1 > prev.x)
            return {
              x: curr.x + 1,
              y: prev.y,
            };
          if (curr.y + 1 > prev.y)
            return {
              x: prev.x,
              y: curr.y + 1,
            };
          return prev;
        },
        { x: 1, y: 1 }
      ),
    [offices]
  );

  return { x, y };
};
