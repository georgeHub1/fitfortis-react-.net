import React from 'react';
import { Redirect, Route } from 'react-router-dom';


import auth from '../backendServices/auth';

export default ({ render, ...rest }) => {
  const cond = auth.isAuthenticated() || rest.location.search;

  if ((rest.path === '/newPassword/:token') && cond) {
    auth.sessionToken = null;
    localStorage.clear();
  }
  return (
    <Route {...rest} render={() => (
      auth.isAuthenticated()
        ? <Redirect to="/metrics" />
        : render
    )}  />
  );
};
