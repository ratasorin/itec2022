import { ReactElement, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import getUser from '../utils/user';
import { url } from '../constants/server';
import { BuildingDB } from '@shared';

function Home(): ReactElement {
  const navigate = useNavigate();
  const [Building, setBuilding] = useState<BuildingDB[]>([]);

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
      const response = await fetch(url('Building'));
      const buildings: BuildingDB[] = await response.json();
      setBuilding(buildings);
    };

    getAllBuilding();
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col items-center p-10">
      <div className="pb-5 font-mono text-3xl font-light">
        Find a free office
      </div>
      <div className="flex w-3/5 flex-col items-center">
        {Building.map(({ name, id }) => (
          <button
            key={name}
            className="mt-5 rounded py-2 px-5 shadow-md transition-all hover:shadow"
            onClick={() =>
              navigate({ pathname: `building/${id}` }, { state: id })
            }
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Home;
