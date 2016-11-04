import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App/index.js';
import HomePage from './containers/HomePage/index.js';
import LoginPage from './containers/LoginPage/index.js';
import AboutPage from './containers/AboutPage/index.js';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="login" component={LoginPage} />
    <Route path="about" component={AboutPage} />
  </Route>
);