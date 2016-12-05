import { combineReducers } from 'redux';
import loginReducer from './containers/LoginPage/reducer.js';
import appReducer from './containers/App/reducer.js';
import signupReducer from './containers/SignupPage/reducer.js';
import studentReducer from './containers/StudentHome/reducer.js';
import professorReducer from './containers/ProfessorHome/reducer.js'

const rootReducer = combineReducers({
  appReducer,
  loginReducer,
  signupReducer,
  studentReducer,
  professorReducer
});

export default rootReducer;
