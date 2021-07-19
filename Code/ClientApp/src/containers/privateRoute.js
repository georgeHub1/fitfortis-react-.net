import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import auth from '../backendServices/auth';

export default Component => (
  <Route render={() => (
    auth.isAuthenticated()
      ? Component
      : <Redirect to="/signUp" />
  )} />);
