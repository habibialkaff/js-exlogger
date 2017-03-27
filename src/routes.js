import React from 'react';
import { Route, IndexRedirect, Redirect } from 'react-router';

import App from './containers/App';
import Authorized from './containers/Authorized';
import HomePage from './containers/HomePage';
import AuthPage from './containers/AuthPage';

export default (
  <Route path="/" component={App}>
    <IndexRedirect to="/home" />
    <Route path="/auth" component={AuthPage} />
    <Route component={Authorized}>
      <Route path="/home" component={HomePage} />
    </Route>
    <Redirect from="*" to="/" />
  </Route>
);
