import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';

import privateRouters from './privateRoute';
import PublicRoute from './publicRoute';

import AdminTools from '../components/AdminTools/AdminTools';
import Metrics from './Metrics/Metrics';
import Devices from '../components/Devices/Devices';
import Documents from '../components/Documents/Documents';
import { DocumentsEntry } from '../components/Documents/DocumentsEntry';
import Encyclopedia from './Encyclopedia/Encyclopedia';
import EncyclopediaTermEntry from '../components/Encyclopedia/EncyclopediaTermEntry';
import EncyclopediaMedicineEntry from '../components/Encyclopedia/EncyclopediaMedicineEntry';
import Home from '../components/Home/Home';
import Hub from '../components/Hub/Hub';
import NewsAndAlerts from '../components/News/NewsAndAlerts';
import Alerts from '../components/Alerts/Alerts';
import HomeNewsEntry from '../components/Home/HomeNewsEntry';
import Profile from '../components/Profile/Profile';
import SymptomChecker from './SymptomChecker/SymptomChecker';
import WrappedSisuSignIn from '../components/Sisu/SisuSignIn';
import SisuContainer from './Sisu/SisuContainer';
import WrappedSisuCreateAccount from '../components/Sisu/SisuCreateAccount';
import WrappedSisuForgotPassword from '../components/Sisu/SisuForgotPassword';
import WrappedSisuNewPassword from '../components/Sisu/SisuNewPassword';
import ConfirmationPage from './ConfirmationPage/ConfirmationPage';
import ScrollToTop from './ScrollToTop';
import AboutDescription from '../components/Common/About';
import AboutPrivacyAndLegal from '../components/Common/PrivacyLegal';

export default () => (
  <Router>
    <ScrollToTop>
      <Switch>
        <PublicRoute
          path="/signIn"
          render={
            <SisuContainer>
              <WrappedSisuSignIn />
            </SisuContainer>
          }
        />
        <PublicRoute
          path="/signUp"
          render={
            <SisuContainer>
              <WrappedSisuCreateAccount />
            </SisuContainer>
          }
        />
        <PublicRoute
          path="/forgotPassword"
          render={
            <SisuContainer>
              <WrappedSisuForgotPassword />
            </SisuContainer>
          }
        />
        <PublicRoute
          path="/newPassword/:token"
          render={
            <SisuContainer>
              <WrappedSisuNewPassword />
            </SisuContainer>
          }
        />
        <PublicRoute path="/confirm" render={<ConfirmationPage />} />
        <Hub>
          <Switch>
            <Route path="/encyclopedia" component={Encyclopedia} />
            <Route path="/encyclopedia/:id" component={EncyclopediaTermEntry} />
            <Route path="/encyclopediaMedicine/:id" component={EncyclopediaMedicineEntry} />
            <Route path="/symptomChecker" component={SymptomChecker} />
            <Route
              path="/encyclopedia/:category/:subcategory"
              component={EncyclopediaTermEntry}
            />
            <Route path="/documents/:text" component={DocumentsEntry} />
            <Route path="/newsfeed/:text" component={HomeNewsEntry} />
            <Route exact path="/" component={Home} />
            <Route exact path="/about" component={AboutDescription} />
            <Route exact path="/about/privacyAndLegal" component={AboutPrivacyAndLegal} />
            {privateRouters(
              <Switch>
                <Route path="/adminTools" component={AdminTools} />
                <Route path="/metrics" component={Metrics}/>
                <Route path="/devices" component={Devices} />
                <Route path="/documents" component={Documents} />
                <Route path="/alerts" component={Alerts} />
                <Route path="/news" component={NewsAndAlerts} />
                <Route path="/profile" component={Profile} />
              </Switch>
            )}
          </Switch>
        </Hub>
      </Switch>
    </ScrollToTop>
  </Router>
);
