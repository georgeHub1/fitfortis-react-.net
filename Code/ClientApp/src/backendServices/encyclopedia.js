import { API_URL } from './../constants/api';
import api from './';
import { STORAGE_KEY } from './auth';
const session = localStorage.getItem(STORAGE_KEY);

let sessionToken = '';

if (session && JSON.parse(session).value) {
  sessionToken = JSON.parse(session).value;
}

export const getEncyclopedia = language => api
  .get(
    `${API_URL}/encyclopedia/search/lang/${language}`,
    {
      Authorization: `Bearer ${sessionToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  )
  .then(data => data)
  .catch(err => null);

export const getEncyclopediaMedicine = language => api
  .get(
    `${API_URL}/encyclopediamedicine/search/lang/${language}`,
    {
      Authorization: `Bearer ${sessionToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  )
  .then(data => data)
  .catch(err => null);

export const saveItemEncyclopediaMedicine = (title, saveItem, userId, isSuccessful) => api
  .patch(
    `${API_URL}/encyclopediamedicine/searchhistory`,
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

export const getDetailsEncyclopediaMedicine = (id, language) => api
  .get(
    `${API_URL}/encyclopediamedicine/${id}/lang/${language}`,
    {
      Authorization: `Bearer ${sessionToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  )
  .then(data => data)
  .catch(err => err);

  export const getHistoryEncyclopediaMedicine = userId => api
  .get(
    `${API_URL}/encyclopediamedicine/searchhistory/user/${userId}`,
    {
      Authorization: `Bearer ${sessionToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  )
  .then(data => data)
  .catch(err => null);

  export const deleteMedicineHistory = id => api
  .delete(
    `${API_URL}/encyclopediamedicine/searchhistory/${id}`,
    {
      Authorization: `Bearer ${sessionToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  )
  .then(data => data)
  .catch(err => null);

export const deleteAllMedicineHistory = userId => api
  .delete(
    `${API_URL}/encyclopediamedicine/searchhistory/user/${userId}`,
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
    `${API_URL}/encyclopedia/searchhistory`,
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

export const getHistory = userId => api
  .get(
    `${API_URL}/encyclopedia/searchhistory/user/${userId}`,
    {
      Authorization: `Bearer ${sessionToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  )
  .then(data => data)
  .catch(err => null);

export const getDetails = (id, language) => api
  .get(
    `${API_URL}/encyclopedia/${id}/lang/${language}`,
    {
      Authorization: `Bearer ${sessionToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  )
  .then(data => data)
  .catch(err => err);

export const deleteHistory = id => api
  .delete(
    `${API_URL}/encyclopedia/searchhistory/${id}`,
    {
      Authorization: `Bearer ${sessionToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  )
  .then(data => data)
  .catch(err => null);

export const deleteAllHistory = userId => api
  .delete(
    `${API_URL}/encyclopedia/searchhistory/user/${userId}`,
    {
      Authorization: `Bearer ${sessionToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  )
  .then(data => data)
  .catch(err => null);
