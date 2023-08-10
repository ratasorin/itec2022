import { ReactElement } from 'react';
import { Outlet } from 'react-router';
import Widgets from './widgets';
function App(): ReactElement {
  return (
    <>
      <Widgets />
      <Outlet />
    </>
  );
}

export default App;
