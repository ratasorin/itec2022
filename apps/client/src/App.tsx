import { ReactElement } from 'react';
import { Outlet } from 'react-router';
import { useUser } from './mock/useUser';

function App(): ReactElement {

  return (
    <div className='grid place-items-center w-screen h-screen'>
      <Outlet/>
    </div>
  )
}

export default App;