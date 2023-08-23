import { ReactElement, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { BuildingStats } from '@shared';
import getUser from '../../utils/user';
import { Button, Rating } from '@mui/material';
import LayoutWithNavbar from '../../layouts/with-navbar';
import { useRatingPopup } from './widgets/rating-popup/rating.slice';
import RatingPopup from './widgets/rating-popup';
import { SERVER_URL } from '../../constants/server';
import HomeSnackbar from './widgets/snackbar-notifications';

export interface BuildingStateNavigation {
  buildingId: string;
  buildingName: string;
}

function percentageToColor(percentage: number) {
  const hue = (percentage * 120) / 100 - 20;
  return `hsl(${hue}, 100%, 45%)`;
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
      const response = await fetch(SERVER_URL + '/building');
      const buildings: BuildingStats[] = await response.json();
      setBuilding(buildings);
    };

    getAllBuilding();
  }, []);

  const openRatingPopup = useRatingPopup((state) => state.open);

  return (
    <>
      <HomeSnackbar />
      <LayoutWithNavbar>
        <div className="flex h-screen w-screen flex-col items-center font-mono">
          <div className="pb-5 text-3xl font-light">Find a free office</div>
          <div className="flex flex-col">
            {Building.map(
              ({
                building_id,
                building_name,
                availability_rate,
                stars,
                reviews,
              }) => (
                <div className="my-3 grid grid-cols-3 grid-rows-2 gap-x-8 rounded border-2 border-zinc-200 bg-white p-6 shadow-lg">
                  <div className="row-start-1">Building</div>
                  <div className="row-start-1">Availability</div>
                  <div className="row-start-1">Ratings</div>
                  <Button
                    variant="outlined"
                    key={building_name}
                    className="row-start-2 border-black font-mono text-black hover:border-black hover:bg-black/5"
                    onClick={() =>
                      navigate(
                        { pathname: `building/${building_id}` },
                        {
                          state: {
                            buildingName: building_name,
                            buildingId: building_id,
                          } as BuildingStateNavigation,
                        }
                      )
                    }
                  >
                    {building_name}
                  </Button>
                  <div
                    className="row-start-2 flex items-center border-l-8 pl-3"
                    style={{
                      borderColor: percentageToColor(availability_rate),
                    }}
                  >
                    {availability_rate.toFixed(1)}%
                  </div>
                  <div
                    className="row-start-2 hover:cursor-pointer"
                    onMouseOver={() => {
                      openRatingPopup({
                        anchorElementId: `${building_id}-rating`,
                        building_id,
                        stars: stars || 0,
                        reviews,
                      });
                    }}
                  >
                    <Rating
                      id={`${building_id}-rating`}
                      name="rating"
                      value={stars || 0}
                      readOnly
                    />
                    <RatingPopup />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </LayoutWithNavbar>
    </>
  );
}

export default Home;
