import { combineReducers } from '@reduxjs/toolkit';
import popups from '../popups/store';
import modals from '../modals/store';

const widgetsReducer = combineReducers({ ...popups, ...modals });

export default widgetsReducer;
