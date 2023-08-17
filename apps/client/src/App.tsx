import { ReactElement, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, useNavigation } from 'react-router';

function App(): ReactElement {
  return <Outlet />;
}

export default App;
