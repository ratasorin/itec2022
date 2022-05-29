import { Floor, Space } from '@prisma/client';
import { FC, useEffect, useState } from 'react';
import { url } from '../../constants/server';

const Board: FC<{ floor: Floor }> = ({ floor }) => {
  const [spaces, setSpaces] = useState<Space[]>([]);

  useEffect(() => {
    const getSpacesOnLevel = async () => {
      const response = await fetch(
        url(`buildings:${floor.building_id}/floor/${floor.id}`)
      );

      const spaces = (await response.json()) as Space[] | undefined;

      if (!spaces) return;
      setSpaces(spaces);
      console.log({ spaces });
    };

    getSpacesOnLevel();
  }, []);

  return <div>{JSON.stringify(spaces)}</div>;
};

export default Board;
