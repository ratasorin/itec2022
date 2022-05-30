import { Floor } from '@prisma/client';
import { RetrievedSpaces } from '@shared';
import { FC, useEffect, useMemo, useState } from 'react';
import { url } from '../../constants/server';
import { useNavigate } from 'react-router';

const bgColor = (book_until: Date | undefined) =>
  book_until ? 'bg-red-400' : 'bg-green-400';

const Board: FC<{ floor: Floor | undefined }> = ({ floor }) => {
  const [spaces, setSpaces] = useState<RetrievedSpaces[]>([]);
  const navigate = useNavigate();
  const { x, y } = useMemo(
    () =>
      spaces.reduce(
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
    [spaces]
  );

  useEffect(() => {
    const getSpacesOnLevel = async () => {
      const response = await fetch(
        url(`buildings/${floor?.building_id}/floor/${floor?.id}`)
      );
      const spaces = (await response.json()) as RetrievedSpaces[] | undefined;

      if (!spaces) return;
      setSpaces(spaces);
      console.log({ spaces });
    };

    getSpacesOnLevel();
  }, [floor]);

  if (!floor) return null;
  if (!spaces || !spaces.length) return <div>No spots found!</div>;

  return (
    <div
      className={`grid aspect-square w-7/12 grid-cols-${y} grid-rows-${x} rounded-2xl bg-slate-500`}
    >
      {spaces.map(({ x, y, id, book_until }) => (
        <div
          onClick={() => {
            navigate(
              {
                pathname: `/timetable/${id}`,
              },
              {
                state: id,
              }
            );
          }}
          className={`
          cursor-pointer rounded-2xl shadow-lg shadow-slate-600 col-span-[${y}] row-span-[${x}] h-1/2 w-1/2	content-center items-center	justify-center justify-items-center self-center justify-self-center text-white transition-all hover:scale-110 
          ${bgColor(book_until)} bold flex text-3xl`}
        >
          {id}
        </div>
      ))}
    </div>
  );
};

export default Board;
