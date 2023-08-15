import { SpacesOnFloor } from '@shared';
import { FC } from 'react';
import { useNavigateOfficeTimetable } from './hooks/navigate-office-timetable';
import { useOfficeCoordinates } from './hooks/office-coordinates';
import { useOpenDetailsPopup } from './offcie-details-popup/open-details';
import DetailsPopup from './offcie-details-popup';

const Board: FC<{ offices: SpacesOnFloor[] }> = ({ offices }) => {
  const { x, y } = useOfficeCoordinates(offices);
  const openDetailsPopup = useOpenDetailsPopup();
  const navigateToOfficeTimetable = useNavigateOfficeTimetable();

  if (!offices.length) return <div>No spots found!</div>;
  return (
    <>
      <DetailsPopup />
      <div
        className="grid aspect-square w-7/12 max-w-md rounded-2xl bg-slate-500"
        style={{
          gridTemplateColumns: `repeat(${y}, 1fr)`,
          gridTemplateRows: `repeat(${x}, 1fr)`,
        }}
      >
        {offices.map((office) => (
          <div
            onMouseOver={(event) => {
              openDetailsPopup(event, office);
            }}
            onClick={() =>
              navigateToOfficeTimetable(office.space_id, office.officeName)
            }
            style={{
              backgroundColor: office.booked_until ? 'red' : 'green',
              gridColumn: office.y + 1,
              gridRow: office.x + 1,
            }}
            className="bold flex h-1/2 w-1/2 cursor-pointer content-center items-center justify-center justify-items-center self-center justify-self-center rounded-2xl text-3xl text-white shadow-lg shadow-slate-600 transition-all hover:scale-110"
          >
            {office.officeName}
          </div>
        ))}
      </div>
    </>
  );
};

export default Board;
