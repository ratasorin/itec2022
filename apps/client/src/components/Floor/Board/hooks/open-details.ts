import { SpacesOnFloor } from '@shared';
import React, { useCallback } from 'react';
import { useWidgetActions } from '../../../../widgets/hooks/useWidgetActions';
import { DetailsActionBlueprint } from '../../../../widgets/popups/components/Details/details.slice';

export const useOpenDetailsPopup = () => {
  const { open: openPopup } =
    useWidgetActions<DetailsActionBlueprint>('details-popup');

  const openDetailsPopup = useCallback(
    (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>,
      office: SpacesOnFloor
    ) => {
      if (!event.currentTarget) return;
      const { left, top, width, height } =
        event.currentTarget.getBoundingClientRect();
      if (office.booked_until)
        openPopup({
          payload: office,
          specification: {
            box: { height, left, top, width },
          },
        });
    },
    [openPopup]
  );

  return openDetailsPopup;
};
