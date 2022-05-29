import { Floor } from '@prisma/client';
import { RetrievedSpaces } from '@shared';
import { FC, useEffect, useState } from 'react';
import { url } from '../../constants/server';

import { Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router';

const Board: FC<{ floor: Floor }> = ({ floor }) => {
  const [spaces, setSpaces] = useState<RetrievedSpaces[]>([]);
  const navigation = useNavigate();
  useEffect(() => {
    const getSpacesOnLevel = async () => {
      const response = await fetch(
        url(`buildings/${floor.building_id}/floor/${floor.id}`)
      );

      const spaces = (await response.json()) as RetrievedSpaces[] | undefined;

      if (!spaces) return;
      setSpaces(spaces);
      console.log({ spaces });
    };

    getSpacesOnLevel();
  }, []);

  if (!spaces || !spaces.length) return <div>No spots found!</div>;

  return (
    <Grid container spacing={2}>
      {spaces.map((space) => (
        <Grid item key={space.id} xs={3} className="w-4">
          <Button
            variant="contained"
            style={{
              background: space.book_until ? 'red' : 'green',
            }}
            onClick={() => {
              navigation(`/timetable/${space.id}`);
            }}
          >
            {space.id}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default Board;
