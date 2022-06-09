import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { StyledEngineProvider } from '@mui/material';

import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router';
import * as ROUTES from './constants/routes';
import AuthPage from './pages/Auth';
import HomePage from './pages/Home';
import BuildingPage from './pages/Building';
import AdminPage from './pages/Admin';
import NotFoundPage from './pages/NotFound';
import TimetablePage from './pages/Timetable';

import { store } from './config/store';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <Router>
          <Routes>
            <Route path={ROUTES.DEFAULT} element={<App />}>
              <Route index element={<HomePage />} />
              <Route path={ROUTES.AUTH} element={<AuthPage />} />
              <Route path={ROUTES.BUILDING} element={<BuildingPage />} />
              <Route path={ROUTES.TIMETABLE} element={<TimetablePage />} />
              <Route path={ROUTES.ADMIN} element={<AdminPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Router>
      </StyledEngineProvider>
    </Provider>
  </React.StrictMode>
);
