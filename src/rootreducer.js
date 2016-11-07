import { combineReducers } from 'redux';
import loginReducer from './containers/LoginPage/reducer.js';
import appReducer from './containers/App/reducer.js';

const rootReducer = combineReducers({
  appReducer,
  loginReducer
});

export default rootReducer;
