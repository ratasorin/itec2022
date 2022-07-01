import { useCallback } from 'react';
import { useNavigate } from 'react-router';

export interface OfficeFromNavigation {
  office_id: string;
  office_name: string;
}

export const useNavigateOfficeTimetable = () => {
  const navigate = useNavigate();
  const navigateToOfficeTimetable = useCallback(
    (space_id: string, office_name: string) => {
      navigate(
        {
          pathname: `/timetable/${space_id}`,
        },
        {
          state: {
            office_id: space_id,
            office_name,
          },
        }
      );
    },
    [navigate]
  );

  return navigateToOfficeTimetable;
};
