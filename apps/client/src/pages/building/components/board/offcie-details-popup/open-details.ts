import { SpacesOnFloor } from '@shared';
import { useDetailsPopup } from 'apps/client/src/pages/building/components/board/offcie-details-popup/details.slice';
import React, { useCallback } from 'react';

export const useOpenDetailsPopup = () => {
  const openPopup = useDetailsPopup((state) => state.open);

  const openDetailsPopup = useCallback(
    (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>,
      office: SpacesOnFloor
    ) => {
      if (!event.currentTarget) return;
      const box = event.currentTarget.getBoundingClientRect();

      if (office.booked_until)
        openPopup({
          box,
          ...office,
        });
    },
    [openPopup]
  );

  return openDetailsPopup;
};
