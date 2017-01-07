import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App/index.js';
import HomePage from './containers/HomePage/index.js';
import LoginPage from './containers/LoginPage/index.js';
import AboutPage from './containers/AboutPage/index.js';
import SignupPage from './containers/SignupPage/index.js';
import StudentHome from './containers/StudentHome/index.js';
import ProfessorHome from './containers/ProfessorHome/index.js';
import ProfChapter from './containers/ProfChapter/index.js';
import ProfCourse from './containers/ProfCourse/index.js'


export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="login" component={LoginPage} />
    <Route path="signup" component={SignupPage} />
    <Route path="student" component={StudentHome} />
    <Route path="professor" component={ProfessorHome} />
    <Route path="chapter/:name/:chapterId" component={ProfChapter} />
    <Route path="course/:name/:courseId" component={ProfCourse} />
  </Route>
);
