import { JwtUser } from '@shared';
import jwtDecode from 'jwt-decode';
import { ReactElement, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import getUser from '../utils/user';
import { url } from '../constants/server';
import { Building } from '@shared';

function SearchPage(): ReactElement {
  const navigate = useNavigate();
  const [Building, setBuilding] = useState<Building[]>([]);

  useEffect(() => {
    const user = getUser();
    if (!user) navigate({ pathname: '/auth' });
  }, [navigate]);

  useEffect(() => {
    const jwt = localStorage.getItem('token');
    console.log({ jwt });
    if (!jwt) return;
    const user = jwtDecode(jwt) as JwtUser;
    console.log({ user });
  }, []);

  useEffect(() => {
    const getAllBuilding = async () => {
      const response = await fetch(url('Building'));
      const Building = (await response.json()) as Building[];
      console.log({ Building });
      setBuilding(Building);
    };

    getAllBuilding();
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col items-center p-10">
      <div className="pb-5 font-mono text-3xl font-light">
        Cauta un loc liber
      </div>
      <div className="flex w-3/5 flex-col items-center">
        {Building.map(({ name, id, floors }) => (
          <button
            key={name}
            className="mt-5 rounded py-2 px-5 shadow-md transition-all hover:shadow"
            onClick={() =>
              navigate({ pathname: `Building/${id}` }, { state: floors })
            }
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchPage;
