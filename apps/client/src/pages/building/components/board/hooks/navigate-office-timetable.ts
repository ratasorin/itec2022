import { useCallback } from 'react';
import { useNavigate } from 'react-router';

export interface OfficeFromNavigation {
  office_id: string;
  office_name: string;
}

export const useNavigateOfficeTimetable = () => {
  const navigate = useNavigate();
  const navigateToOfficeTimetable = useCallback(
    (office_id: string, office_name: string) => {
      navigate(
        {
          pathname: `/timetable/${office_id}`,
        },
        {
          state: {
            office_id: office_id,
            office_name,
          },
        }
      );
    },
    [navigate]
  );

  return navigateToOfficeTimetable;
};
