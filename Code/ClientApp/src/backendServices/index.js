import auth from './auth.js';

const MIN_LOADING_TIME = 200;

const waitFor = promise => {
  const timeout = new Promise(resolve => {
    setTimeout(resolve, MIN_LOADING_TIME);
  });

  return Promise.all([promise, timeout]).then(([arg]) => arg);
};

const api = {
  fetch (
    method,
    url,
    headers,
    body,
    options
  ) {
const token = auth && auth.getSessionToken();
const AUTHORIZATION_HEADER = token ? { 'Authorization': `Bearer ${token}` } : {};
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    return waitFor(
      fetch(url, {
        method,
        headers: { ...defaultHeaders, ...headers, ...AUTHORIZATION_HEADER },
        body: JSON.stringify(body)
      })
    )
    .then(res => {
      return res.json();
    })
    .then(res => {
      if (res.success === false) return Promise.reject(res);
      return res;
    });
  },

  get (...args) {
    return this.fetch('GET', ...args);
  },

  post (...args) {
    return this.fetch('POST', ...args);
  },

  put (...args) {
    return this.fetch('PUT', ...args);
  },

  delete (...args) {
    return this.fetch('DELETE', ...args);
  },

  patch (...args) {
    return this.fetch('PATCH', ...args);
  }
};

export default api;
