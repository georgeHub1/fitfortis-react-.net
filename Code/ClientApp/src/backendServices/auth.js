import { API_URL } from './../constants/api';
import api from './';

export const STORAGE_KEY = 'session';

class Auth {
  constructor () {
    this.sessionToken = null;

    const session = localStorage.getItem(STORAGE_KEY);

    if (session && JSON.parse(session).value) {
      this.sessionToken = JSON.parse(session).value;
    }
  }

  registratration (language, formData) {
    const data = {...formData};

    data.language = language;
    return api
      .post(
        `${API_URL}/sisu/register`,
        {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        { data }
      ).then(res => res)
      .catch(err => Promise.reject(err));
  }
  forgotPassword (data) {
    return api
      .post(
        `${API_URL}/sisu/password/forgot`,
        {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        { data }
      ).then(res => res)
      .catch(err => Promise.reject(err));
  }
  resetPassword (data) {
    return api
      .post(
        `${API_URL}/sisu/password/forgot/reset`,
        {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        { data }
      ).then(res => res)
      .catch(err => Promise.reject(err));
  }
  changePassword (data) {
    return api
    .post(
      `${API_URL}/sisu/password/change`,
      {
        Authorization: `Bearer ${this.sessionToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        { data }
      ).then(res => res)
      .catch(err => Promise.reject(err));
  }

  confirmation (emailConfirmationToken, userId) {
    return api
      .post(
        `${API_URL}/sisu/register/confirm`,
        {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        {data: {
        emailConfirmationToken, userId
      }}).then(res => res);
  }

  accountMe (value, push) {
    return api
      .get(
        `${API_URL}/profile/account/me`,
        {
          Authorization: `Bearer ${value}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      ).then(res => {
        this.sessionToken = value;
        localStorage.setItem(STORAGE_KEY, JSON.stringify({value}));
        push('/');

        return res;
      });
  }

  userRole (value) {
    return api
      .get(
        `${API_URL}/admintools/role`,
        {
          Authorization: `Bearer ${value}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      ).then(res => {
        return res;
      });
  }
  authenticate (email, password) {
    return api
      .post(
        `${API_URL}/sisu/login`,
        {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        {data: {
          email,
          password
        }}
      ).then(({ item }) => item.token)
      .catch(({ errors }) => Promise.reject(errors));
  }

  isAuthenticated () {
    return this.getToken() !== '';
  }

  getToken () {
    return localStorage.getItem(STORAGE_KEY) ? JSON.parse(localStorage.getItem(STORAGE_KEY)).value : '';
  }

  getSessionToken () {
    return this.sessionToken || this.getToken();
  }
}

const auth = new Auth();

export default auth;
