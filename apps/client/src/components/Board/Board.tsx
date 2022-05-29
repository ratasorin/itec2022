import { Floor } from '@prisma/client';
import { RetrievedSpaces } from '@shared';
import { FC, useEffect, useState } from 'react';
import { url } from '../../constants/server';
import { useNavigate } from 'react-router';

const Board: FC<{ floor: Floor | undefined }> = ({ floor }) => {
  const [spaces, setSpaces] = useState<RetrievedSpaces[]>([]);
  const navigation = useNavigate();
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
      className={`w-2/3 aspect-square bg-slate-500 rounded-2xl grid grid-cols-2 grid-rows-2 text-2xl bold`}
    >
      {spaces.map(({ x, y, id, book_until }) => (
        <div
          className={`rounded-2xl shadow-lg  shadow-slate-600 col-span-${
            y + 1
          } row-span-${
            x + 1
          }  justify-self-center items-center	content-center justify-items-center	self-center justify-center text-white w-1/2 h-1/2 ${
            book_until ? 'bg-red-400' : 'bg-green-400'
          } flex `}
        >
          {' '}
          {id}{' '}
        </div>
      ))}
    </div>
  );
};

export default Board;
