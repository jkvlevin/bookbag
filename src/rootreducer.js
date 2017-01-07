import { combineReducers } from 'redux';
import loginReducer from './containers/LoginPage/reducer.js';
import signupReducer from './containers/SignupPage/reducer.js';
import studentReducer from './containers/StudentHome/reducer.js';
import professorReducer from './containers/ProfessorHome/reducer.js';
import chapterReducer from './containers/ProfChapter/reducer.js';
import courseReducer from './containers/ProfCourse/reducer.js';


const rootReducer = combineReducers({
  loginReducer,
  signupReducer,
  studentReducer,
  professorReducer,
  chapterReducer,
  courseReducer
});

export default rootReducer;
