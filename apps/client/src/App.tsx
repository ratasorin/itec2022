import { ReactElement } from 'react';
import { Outlet } from 'react-router';
import Widgets from './widgets';
function App(): ReactElement {
  return (
    <>
      <Widgets />
      <div className="grid h-screen w-screen place-items-center">
        <Outlet />
      </div>
    </>
  );
}

export default App;
