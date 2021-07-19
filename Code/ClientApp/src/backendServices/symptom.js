import { API_URL } from './../constants/api';
import api from './';
import { STORAGE_KEY } from './auth';
const session = localStorage.getItem(STORAGE_KEY);

let sessionToken = '';

if (session && JSON.parse(session).value) {
	sessionToken = JSON.parse(session).value;
}

export const getSymptoms = language => api
  .get(
    `${API_URL}/symptomchecker/search/lang/${language}`,
    {
      Authorization: `Bearer ${sessionToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  )
  .then(data => data)
  .catch(err => null);

export const getSymptomDetails = (id, language) => api
  .get(
    `${API_URL}/encyclopedia/${id}/lang/${language}`,
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
    `${API_URL}/symptomchecker/searchhistory`,
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
