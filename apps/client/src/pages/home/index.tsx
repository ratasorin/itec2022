import { ReactElement, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { BuildingStats } from '@shared';
import getUser from '../../utils/user';
import { url } from '../../constants/server';
import { Button, Rating } from '@mui/material';
import LayoutWithNavbar from '../../layouts/with-navbar';

function percentageToColor(percentage: number, maxHue = 120, minHue = 0) {
  const hue = percentage * (maxHue - minHue) + minHue;
  return `hsl(${hue}, 100%, 50%)`;
}

function Home(): ReactElement {
  const navigate = useNavigate();
  const [Building, setBuilding] = useState<BuildingStats[]>([]);

  useEffect(() => {
    const user = getUser();
    if (!user) navigate({ pathname: '/auth' });
  }, [navigate]);

  useEffect(() => {
    const jwt = localStorage.getItem('token');
    if (!jwt) return;
  }, []);

  useEffect(() => {
    const getAllBuilding = async () => {
      const response = await fetch(url('building'));
      const buildings: BuildingStats[] = await response.json();
      setBuilding(buildings);
    };

    getAllBuilding();
  }, []);

  return (
    <LayoutWithNavbar>
      <div className="flex h-screen w-screen flex-col items-center font-mono">
        <div className="pb-5 text-3xl font-light">Find a free office</div>
        <div className="flex flex-col">
          {Building.map(({ name, id, availability_rate, stars }) => (
            <div className="my-3 grid grid-cols-3 grid-rows-2 gap-x-8 rounded bg-white p-6 shadow-md">
              <div className="row-start-1">Building</div>
              <div className="row-start-1">Availability</div>
              <div className="row-start-1">Ratings</div>
              <Button
                variant="outlined"
                key={name}
                className="row-start-2 border-black font-mono text-black hover:border-black hover:bg-black/5"
                onClick={() =>
                  navigate({ pathname: `building/${id}` }, { state: id })
                }
              >
                {name}
              </Button>
              <div
                className="row-start-2 flex items-center border-l-8 pl-3"
                style={{
                  borderColor: percentageToColor(availability_rate),
                }}
              >
                {availability_rate.toFixed(1)}%
              </div>
              <div className="row-start-2">
                {<Rating name="rating" value={stars || 0} readOnly />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </LayoutWithNavbar>
  );
}

export default Home;
