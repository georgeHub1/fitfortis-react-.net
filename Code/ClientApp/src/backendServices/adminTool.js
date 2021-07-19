import { API_URL } from './../constants/api';
import { STORAGE_KEY } from './auth';
import { base64StringtoFile} from '../utils/common';
import api from './';

const session = localStorage.getItem(STORAGE_KEY);

let sessionToken = '';

if (session && JSON.parse(session).value) {
  sessionToken = JSON.parse(session).value;
}

const getToken = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)).value;
};

export const createAdminTool = data => api
  .post(
    `${API_URL}/news`,
    {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    {data}
  )
  .then(data => data)
  .catch(err => err);


export const uploadAdminToolImage = (base64, name) => {
  const adminToolImage = base64StringtoFile(base64, 'test.jpg');

  var formdata = new FormData();

  formdata.append('File', adminToolImage, adminToolImage.name);
  formdata.append('Name', adminToolImage.name);

  return fetch(`${API_URL}/news/picture/upload`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: formdata
  })
  .then(res => {
    return res.json();
  })
  .then(res => {
    if (res && res.success === false) return Promise.reject(res);
    else if (res && res.success) return Promise.resolve(res.item);
    return Promise.reject(res);
  }).catch(err => {
    return err;
  });
};


export const getNewsList = language => api
  .get(
    `${API_URL}/news/lang/${language}`,
    {
      Authorization: `Bearer ${sessionToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  )
  .then(data => data)
  .catch(err => null);


export const getAdminToolNewsList = () => api
  .get(
    `${API_URL}/admintools/news`,
    {
      Authorization: `Bearer ${sessionToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  )
  .then(data => data)
  .catch(err => null);

export const getAdminToolRecyclebinNewsList = () => api
  .get(
    `${API_URL}/admintools/news/recyclebin`,
    {
      Authorization: `Bearer ${sessionToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  )
  .then(data => data)
  .catch(err => null);


export const getAdminUserList = () => api
  .get(
    `${API_URL}/admintools/role/admin/user`,
    {
      Authorization: `Bearer ${sessionToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  )
  .then(data => data)
  .catch(err => null);


export const getNewsDetail = (newsId, userId, language) => api
  .get(
    `${API_URL}/news/${newsId}`,
    {
      Authorization: `Bearer ${sessionToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  )
  .then(data => data)
  .catch(err => null);


export const likeNewsFeed = data => api
  .post(
    `${API_URL}/news/like`,
    {
      Authorization: `Bearer ${sessionToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    {data}
  )
  .then(data => data)
  .catch(err => null);

export const unLikeNewsFeed = (newId, userId) => api
  .delete(
    `${API_URL}/news/${newId}/user/${userId}/like`,
    {
      Authorization: `Bearer ${sessionToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  )
  .then(data => data)
  .catch(err => null);

export const deleteNewsFeed = (newId, userId) => api
  .delete(
    `${API_URL}/news/${newId}`,
    {
      Authorization: `Bearer ${sessionToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  )
  .then(data => data)
  .catch(err => null);

export const updateNewsFeed = (newId, data) => api
  .put(
    `${API_URL}/news/${newId}`,
    {
      Authorization: `Bearer ${sessionToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    { data }
  )
  .then(data => data)
  .catch(err => null);

export const restoreNewsFeed = data => api
  .put(
    `${API_URL}/admintools/news/restore`,
    {
      Authorization: `Bearer ${sessionToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    { data }
  )
  .then(data => data)
  .catch(err => null);

export const inactiveNewsFeed = newId => api
  .put(
    `${API_URL}/admintools/news/${newId}/inactivate`,
    {
      Authorization: `Bearer ${sessionToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  )
  .then(data => data)
  .catch(err => null);

export const saveItem = (title, saveItem, userId, isSuccessful) => api
  .patch(
    `${API_URL}/news/searchhistory`,
    {
      Authorization: `Bearer ${sessionToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    {
      data:{
        'SearchText': title,
        'UserId': userId,
        'LinkedEntityId': saveItem,
        'IsSuccessful': isSuccessful
      }
    }
  )
  .then(data => data)
  .catch(err => null);

export const fetchAnalytics = language => api
  .post(
    `${API_URL}/admintools/analytic/details/lang/${language}`,
    {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    {}
  )
  .then(res => res)
  .catch(err => err);

  export const getAnalyticDetailsData = language => api
  .get(
    `${API_URL}/admintools/analytic/details/lang/${language}`,
    {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  )
  .then(res => {
    return res;
  })
  .catch(err => err);

