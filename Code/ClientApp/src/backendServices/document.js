import { API_URL } from './../constants/api';
import { STORAGE_KEY } from './auth';
import moment from 'moment';
import api from './';

const session = localStorage.getItem(STORAGE_KEY);

let sessionToken = '';

if (session && JSON.parse(session).value) {
  sessionToken = JSON.parse(session).value;
}

const getToken = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)).value;
};

export const getAllDocuments = userId => api
  .get(
    `${API_URL}/document/user/${userId}`,
    {
      Authorization: `Bearer ${sessionToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  )
  .then(data => data)
  .catch(err => null);

export const getRemovedDocuments = userId => api
  .get(
    `${API_URL}/document/user/${userId}/recyclebin`,
    {
      Authorization: `Bearer ${sessionToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  )
  .then(data => data)
  .catch(err => null);

export const removeDocument = id => api
  .put(
    `${API_URL}/document/${id}/inactivate`,
    {
      Authorization: `Bearer ${sessionToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  )
  .then(data => data)
  .catch(err => null);

export const deleteDocument = id => api
  .delete(
    `${API_URL}/document/${id}`,
    {
      Authorization: `Bearer ${sessionToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  )
  .then(data => data)
  .catch(err => null);

export const restoreDocument = (userId, data) => api
  .put(
    `${API_URL}/document/user/${userId}/restore`,
    {
      Authorization: `Bearer ${sessionToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    { data }
  )
  .then(data => data)
  .catch(err => null);

export const updateDocument = (id, data) => api
  .put(
    `${API_URL}/document/${id}`,
    {
      Authorization: `Bearer ${sessionToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    {data}
  )
  .then(data => data)
  .catch(err => null);


export const createDocumentAPI = (userId, data) => {
  var formdata = new FormData();

  formdata.append('File', data.file, data.name);
  formdata.append('Name', data.name);
  formdata.append('Type', data.type);
  formdata.append('Description', data.description);
  formdata.append('Date', moment(data.date).utc().format());
  formdata.append('FileSize', data.size);

  return fetch(`${API_URL}/document/user/${userId}/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sessionToken || getToken()}`
    },
    body: formdata
  })
  .then(res => {
    return res.json();
  })
  .then(res => {
    if (res && res.success === false) return Promise.reject(res);
    return res;
  }).catch(err => {
    return err;
  });
};

export const saveItem = (title, saveItem, userId, isSuccessful) => api
  .patch(
    `${API_URL}/document/searchhistory`,
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
