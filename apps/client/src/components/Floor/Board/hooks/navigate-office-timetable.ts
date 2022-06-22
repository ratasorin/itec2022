import { useCallback } from 'react';
import { useNavigate } from 'react-router';

export const useNavigateOfficeTimetable = () => {
  const navigate = useNavigate();
  const navigateToOfficeTimetable = useCallback(
    (space_id: string) => {
      navigate(
        {
          pathname: `/timetable/${space_id}`,
        },
        {
          state: space_id,
        }
      );
    },
    [navigate]
  );

  return navigateToOfficeTimetable;
};
