import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router';

import { StyledEngineProvider } from '@mui/material';

import * as ROUTES from './constants/routes';
import AuthPage from './pages/authpage.component';
import AdminPage from './pages/adminpage.component';
import SearchPage from './pages/searchpage.component';
import CampusPage from './pages/campuspage.component';
import NotFoundPage from './pages/notfoundpage.component';
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
              <Route index element={<SearchPage />} />
              <Route path={ROUTES.AUTH} element={<AuthPage />} />
              <Route path={ROUTES.CAMPUS} element={<CampusPage />} />
              <Route path={ROUTES.ADMIN} element={<AdminPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Router>
      </StyledEngineProvider>
    </Provider>
  </React.StrictMode>
);
