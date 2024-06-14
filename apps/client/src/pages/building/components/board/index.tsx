import { OfficesOnFloor } from '@shared';
import { FC } from 'react';
import { useNavigateOfficeTimetable } from './hooks/navigate-office-timetable';
import { useOfficeCoordinates } from './hooks/office-coordinates';
import { useDetailsPopup } from '@client/pages/building/widgets/office-details-popup/details.slice';

const Board: FC<{ offices: OfficesOnFloor[] }> = ({ offices }) => {
  const { x, y } = useOfficeCoordinates(offices);
  const openDetailsPopup = useDetailsPopup((state) => state.open);
  const closeDetailsPopup = useDetailsPopup((state) => state.close);
  const navigateToOfficeTimetable = useNavigateOfficeTimetable();

  if (!offices.length) return <div>No spots found!</div>;
  return (
    <div
      className="font-poppins grid aspect-square w-full rounded-2xl bg-slate-400"
      style={{
        gridTemplateColumns: `repeat(${y}, 1fr)`,
        gridTemplateRows: `repeat(${x}, 1fr)`,
      }}
    >
      {offices.map((office) => (
        <div
          onMouseOver={(event) => {
            if (!office.booked_until) return;

            const box = event.currentTarget.getBoundingClientRect();
            openDetailsPopup({ ...office, x, y, box });
          }}
          onClick={() => {
            navigateToOfficeTimetable(office.office_id, office.officeName);
            closeDetailsPopup();
          }}
          style={{
            backgroundColor: office.booked_until ? '#dc2626' : '#16a34a',
            borderColor: office.booked_until ? '#b91c1c' : '#15803d',
            gridColumn: office.y + 1,
            gridRow: office.x + 1,
          }}
          className="flex h-3/5 w-3/5 cursor-pointer content-center items-center justify-center justify-items-center self-center justify-self-center rounded-2xl border-4 px-1 text-center text-3xl font-bold text-white transition-all hover:scale-110 "
        >
          {office.officeName}
        </div>
      ))}
    </div>
  );
};

export default Board;
