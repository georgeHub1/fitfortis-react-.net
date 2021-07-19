import ReactGA from 'react-ga';
import * as firebase from 'firebase/app';
import 'firebase/analytics';
import auth from '../backendServices/auth';

declare const window: any;
const googleAnalyticID = 'UA-158100904-1';
const googleOptimizeID= 'OPT-MTR8NXP';
const optimizeExperimentId = 'Zo7b_2CqSseKSjw2G2Le4Q';


export const firebaseConfig = {
    apiKey: 'AIzaSyA5ioZ-lMHKL1NbKoPo06WcWj3_fFEjplI',
    authDomain: 'fitfortis-20200928.firebaseapp.com',
    databaseURL: 'https://fitfortis-20200928.firebaseio.com',
    projectId: 'fitfortis-20200928',
    storageBucket: 'fitfortis-20200928.appspot.com',
    messagingSenderId: '841736138954',
    appId: '1:841736138954:web:d4c63168018b81546a4433',
    measurementId: 'G-Y1S2CMVBJH'
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const language = localStorage.getItem('language');

let userIdValue = '';

const firebaseAnalyticsSetUserProperties = () => {
    firebase.analytics().setUserProperties({ language, isAnonymous: !auth.isAuthenticated()});
};

const firebaseAnalyticsLog = (event, parameters) => {
    try {
        firebaseAnalyticsSetUserProperties();
        if (parameters === undefined) parameters = {};
        parameters.appLanguage  = language;
        parameters.userId = userIdValue;
        parameters.isAnonymous = !auth.isAuthenticated();
        firebase.analytics().logEvent(event, parameters);
    } catch (error) {}
};

const firebaseAnalyticUserId = userId => {
    userIdValue = userId;
    try {
        firebase.analytics().setUserId(userId);
    } catch (err) {}
};

const initializeAnalytics = () => {
    ReactGA.initialize(googleAnalyticID);
}

const  initializeAbTests = () =>  {
    ReactGA.ga('require', googleOptimizeID);
    ReactGA.ga('send', 'pageview');
    if (window.dataLayer) {
      window.dataLayer.push({'event': 'optimize.activate'});
    }
}

const checkIsUserType = () => {
    const intervalId = setInterval(() => {
        if (window.google_optimize !== undefined) {
            const variant = window.google_optimize.get(optimizeExperimentId);
            let userType = variant === '1' ? 'AbTestUser' : 'NormalUser';
            localStorage.setItem('userType', userType);
            clearInterval(intervalId);
        }
      }, 100);
}

const abTest_isCreateAccountInRed = () => {
    const userType = localStorage.getItem('userType');
    if (userType) {
        if (userType === 'AbTestUser') {
            return true;
        }
        return false;
    }
}
const abTest_isArticlesInRandomOrder = () => {
    const userType = localStorage.getItem('userType');
    if (userType) {
        if (userType === 'AbTestUser') {
            return true;
        }
        return false;
    }
}

export default {
    googleAnalyticID,
    googleOptimizeID,
    initializeAbTests,
    initializeAnalytics,
    checkIsUserType,
    abTest_isCreateAccountInRed,
    firebaseAnalyticUserId,
    firebaseAnalyticsLog,
    firebaseAnalyticsSetUserProperties,
    abTest_isArticlesInRandomOrder,
};
