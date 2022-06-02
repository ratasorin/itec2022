import { combineReducers } from '@reduxjs/toolkit';
import popup from './popup';

const widgetsReducer = combineReducers({ popup });

export default widgetsReducer;
