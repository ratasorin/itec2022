import { ReactElement } from 'react';
import { Outlet } from 'react-router';

function App(): ReactElement {
  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
