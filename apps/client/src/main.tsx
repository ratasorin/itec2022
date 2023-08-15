import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { StyledEngineProvider } from '@mui/material';

import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router';
import * as ROUTES from './constants/routes';
import AuthPage from './pages/auth';
import HomePage from './pages/home';
import BuildingPage from './pages/building';
import AdminPage from './pages/admin';
import NotFoundPage from './pages/not-found';
import TimetablePage from './pages/timetable';
import AccountPage from './pages/account';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <Router>
        <Routes>
          <Route path={ROUTES.DEFAULT} element={<App />}>
            <Route index element={<HomePage />} />
            <Route path={ROUTES.AUTH} element={<AuthPage />} />
            <Route path={ROUTES.BUILDING} element={<BuildingPage />} />
            <Route path={ROUTES.TIMETABLE} element={<TimetablePage />} />
            <Route path={ROUTES.ADMIN} element={<AdminPage />} />
            <Route path={ROUTES.ACCOUNT} element={<AccountPage />}></Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Router>
    </StyledEngineProvider>
  </React.StrictMode>
);
