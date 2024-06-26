import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { StyledEngineProvider, ThemeProvider } from '@mui/material';

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
import { theme } from './utils/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EditBuilding from './pages/building/edit';
import { Provider, createStore } from 'jotai';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

export const queryClient = new QueryClient();
export const jotaiStore = createStore();

root.render(
  <React.StrictMode>
    <Provider store={jotaiStore}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <StyledEngineProvider injectFirst>
            <Router>
              <Routes>
                <Route path={ROUTES.DEFAULT} element={<App />}>
                  <Route index element={<HomePage />} />
                  <Route path={ROUTES.AUTH} element={<AuthPage />} />
                  <Route path={ROUTES.BUILDING} element={<BuildingPage />} />
                  <Route path={ROUTES.TIMETABLE} element={<TimetablePage />} />
                  <Route path={ROUTES.ADMIN} element={<AdminPage />} />
                  <Route
                    path={ROUTES.ACCOUNT}
                    element={<AccountPage />}
                  ></Route>
                  <Route
                    path={ROUTES.BUILDING_EDIT}
                    element={<EditBuilding />}
                  ></Route>
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </Router>
          </StyledEngineProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
