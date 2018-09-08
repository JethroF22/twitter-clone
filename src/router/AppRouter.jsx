import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import LandingPage from '../components/LandingPage';
import Error404 from '../components/routes/Error404';

const AppRouter = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={LandingPage} />
      <Route component={Error404} />
    </Switch>
  </BrowserRouter>
);

export default AppRouter;
