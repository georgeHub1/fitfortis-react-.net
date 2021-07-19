import api from './';
import { API_URL } from './../constants/api';
import {arrayBufferToBase64, base64StringtoFile} from '../utils/common';
import { STORAGE_KEY } from './auth';
const session = localStorage.getItem(STORAGE_KEY);

let sessionToken = '';

if (session && JSON.parse(session).value) {
	sessionToken = JSON.parse(session).value;
}

const getToken = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)).value;
};

const profileFetchBasicInformation = (userId, language) => api
  .get(`${API_URL}/profile/basicinformation/user/${userId}/lang/${language}`)
  .then(data => data.items)
  .catch(err => { throw err; });

const profileFetchChronicConditions = (userId, language) => api
  .get(`${API_URL}/profile/chroniccondition/user/${userId}/lang/${language}`)
  .then(data => data.items)
  .catch(err => { throw err; });

const profileUpdateChronicConditions = body => api
  .post(`${API_URL}/profile/chroniccondition/user/${body.userId}`, {}, {'data': body.data})
  .then(data => data.items)
  .catch(err => { throw err; });

const profileDeleteChronicConditions = body => api
  .delete(`${API_URL}/profile/chroniccondition/user/${body.userId}`, {}, {'data': body.data})
  .then(data => data.items)
  .catch(err => { throw err; });

const profileFetchFamilyHistory = (userId, language) => api
  .get(`${API_URL}/profile/familyhistory/user/${userId}/lang/${language}?startitem=1&maxitems=1000`)
  .then(data => data.items)
  .catch(err => { throw err; });

const profileUpdateFamilyHistory = body => api
  .post(`${API_URL}/profile/familyhistory/user/${body.userId}`, {}, {'data': body.data})
  .then(data => data.items)
  .catch(err => { throw err; });

const profileDeleteFamilyHistory = body => api
  .delete(`${API_URL}/profile/familyhistory/user/${body.userId}`, {}, {'data': body.data})
  .then(data => data.items)
  .catch(err => { throw err; });

const profileFetchTherapy = userId => api
  .get(`${API_URL}/therapy/user/${userId}?startitem=1&maxitems=1000`)
  .then(data => data.items)
  .catch(err => { throw err; });
const profileUpdateTherapy = body => api
  .post(`${API_URL}/therapy/user/${body.userId}`, {}, {'data': body.data})
  .then(data => data.items)
  .catch(err => { throw err; });

const profileDeleteTherapy = body => api
  .delete(`${API_URL}/therapy/user/${body.userId}`, {}, {'data': body.data})
  .then(data => data.items)
  .catch(err => { throw err; });

const profileFetchTherapyVaccine = (userId, language) => api
  .get(`${API_URL}/profile/therapyandvaccine/user/${userId}/lang/${language}?startitem=1&maxitems=1000`)
  .then(data => data.items)
  .catch(err => { throw err; });
const profileUpdateTherapyVaccine = body => api
  .post(`${API_URL}/profile/therapyandvaccine/user/${body.userId}`, {}, {'data': body.data})
  .then(data => data.items)
  .catch(err => { throw err; });

const profileDeleteTherapyVaccine = body => api
  .delete(`${API_URL}/profile/therapyandvaccine/user/${body.userId}`, {}, {'data': body.data})
  .then(data => data.items)
  .catch(err => { throw err; });

const profileFetchLifeStyle = (userId, language) => api
  .get(`${API_URL}/profile/lifestyle/user/${userId}/lang/${language}`)
  .then(data => data.items)
  .catch(err => { throw err; });

const getUserInfo = userId => api
  .get(`${API_URL}/user/${userId}`)
  .then(data => data.item)
  .catch(err => { throw err; });

const updateUserInfo = body => api
  .put(`${API_URL}/user/${body.data.userId}`, {}, body)
  .then(data => data.item)
  .catch(err => { throw err; });

const profileUpdateLifeStyle = body => api
  .put(`${API_URL}/profile/lifestyle/user/${body.userId}`, {}, body.data)
  .then(data => data.item)
  .catch(err => { throw err; });

const profileUpdateBasicInformation = body => api
  .put(`${API_URL}/profile/basicinformation/user/${body.userId}`, {}, body.data)
  .then(data => data.item)
  .catch(err => { throw err; });

const profileUpploadAvatar = body => {
  var formdata = new FormData();
  const fileAvatar = base64StringtoFile(body.avatar, 'avatar.png');

  formdata.append('File', fileAvatar, fileAvatar.name);
  formdata.append('Name', fileAvatar.name);

  return fetch(`${API_URL}/profile/avatar/user/${body.userId}/upload`, {
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
    if (res && res.success === false)
      return Promise.reject(res);
    return {account: res};
  }).catch(err => {
    return err;
  });
};

const profileFetchAvatar = async (userId, token) => {
  return await fetch(`${API_URL}/profile/avatar/user/${userId}/download`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    responseType: 'blob'
  })
  .then(response => {
    if (response.ok) {
      return response.arrayBuffer().then(buffer => {
        var base64Flag = 'data:image/jpeg;base64,';
        var imageStr = arrayBufferToBase64(buffer);

        return base64Flag + imageStr;
      });
    }
    return response;
  })
  .then(response => {
      return {avatar: response};
  }).then(res => {
    if (res.success === false)
      return Promise.reject(res);
    return res;
  }).catch(err => {
    return err;
  });
};

export default {
    updateUserInfo,
    getUserInfo,
    profileFetchBasicInformation,
    profileUpdateBasicInformation,
    profileUpdateLifeStyle,
    profileFetchChronicConditions,
    profileUpdateChronicConditions,
    profileDeleteChronicConditions,
    profileFetchFamilyHistory,
    profileUpdateFamilyHistory,
    profileDeleteFamilyHistory,
    profileFetchTherapy,
    profileUpdateTherapy,
    profileDeleteTherapy,
    profileFetchTherapyVaccine,
    profileUpdateTherapyVaccine,
    profileDeleteTherapyVaccine,
    profileFetchLifeStyle,
    profileFetchAvatar,
    profileUpploadAvatar
};
