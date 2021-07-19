import { message } from 'antd';
import { API_URL } from '../constants/api';
import { STORAGE_KEY } from '../backendServices/auth';
import { saveAs } from 'file-saver';
import axios from 'axios';
import print from 'print-js';
import { createDocumentAPI, getAllDocuments, getRemovedDocuments, removeDocument, restoreDocument, updateDocument, deleteDocument, saveItem } from '../backendServices/document';


const session = localStorage.getItem(STORAGE_KEY);

let sessionToken = '';

if (session && JSON.parse(session).value) {
  sessionToken = JSON.parse(session).value;
}

const getToken = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)).value;
};

export const START_CREATE_DOCUMENT = 'START_CREATE_DOCUMENT';
export const SUCCESS_IN_CREATE_DOCUMENT = 'SUCCESS_IN_CREATE_DOCUMENT';
export const ERROR_IN_CREATE_DOCUMENT = 'ERROR_IN_CREATE_DOCUMENT';

export const START_UPDATE_DOCUMENT = 'START_UPDATE_DOCUMENT';
export const SUCCESS_IN_UPDATE_DOCUMENT = 'SUCCESS_IN_UPDATE_DOCUMENT';
export const ERROR_IN_UPDATE_DOCUMENT = 'ERROR_IN_UPDATE_DOCUMENT';


export const FETCHING_ALL_DOCUMENTS = 'FETCHING_ALL_DOCUMENTS';
export const FETCHING_ALL_REMOVED_DOCUMENTS = 'FETCHING_ALL_REMOVED_DOCUMENTS';

export const START_REMOVE_DOCUMENT = 'START_REMOVE_DOCUMENT';
export const SUCCESS_IN_REMOVE_DOCUMENT = 'SUCCESS_IN_REMOVE_DOCUMENT';

export const START_DELETE_DOCUMENT = 'START_DELETE_DOCUMENT';
export const SUCCESS_IN_DELETE_DOCUMENT = 'SUCCESS_IN_DELETE_DOCUMENT';


export const START_RESTORE_DOCUMENT = 'START_RESTORE_DOCUMENT';
export const SUCCESS_IN_RESTORE_DOCUMENT = 'SUCCESS_IN_RESTORE_DOCUMENT';
export const ERROR_IN_RESTORE_DOCUMENT = 'ERROR_IN_RESTORE_DOCUMENT';


export const UPDATE_DOCUMENT_DOWNALOD_PERCENTAGE = 'UPDATE_DOCUMENT_DOWNALOD_PERCENTAGE';
export const START_DOWNLOAD_DOCUMENT  = 'START_DOWNLOAD_DOCUMENT';
export const DOCUMENT_DOWNLOAD_SUCCESS = 'DOCUMENT_DOWNLOAD_SUCCESS';
export const DOCUMENT_DOWNLOAD_FAILED = 'DOCUMENT_DOWNLOAD_FAILED';


export const UPDATE_DOCUMENT_PRINT_PERCENTAGE = 'UPDATE_DOCUMENT_PRINT_PERCENTAGE';
export const START_PRINT_DOCUMENT  = 'START_PRINT_DOCUMENT';
export const DOCUMENT_PRINT_SUCCESS = 'DOCUMENT_PRINT_SUCCESS';
export const DOCUMENT_PRINT_FAILED = 'DOCUMENT_PRINT_FAILED';

export const fetchedAllDocuments = data => ({
    type: FETCHING_ALL_DOCUMENTS,
    data
});

export const fetchedAllRemovedDocuments = data => ({
    type: FETCHING_ALL_REMOVED_DOCUMENTS,
    data
});


export const startCreatingDocument  = () => ({
    type: START_CREATE_DOCUMENT
});

export const successCreateDocument = data => ({
    type: SUCCESS_IN_CREATE_DOCUMENT,
    data
});

export const failedCreateDocument = err => ({
    type: ERROR_IN_CREATE_DOCUMENT,
    err
});


export const startUpdatingDocument  = () => ({
    type: START_UPDATE_DOCUMENT
});

export const successUpdateDocument = data => ({
    type: SUCCESS_IN_UPDATE_DOCUMENT,
    data
});

export const failedUpdateDocument = err => ({
    type: ERROR_IN_UPDATE_DOCUMENT,
    err
});


export const startRemoveDocument  = () => ({
    type: START_REMOVE_DOCUMENT
});

export const successRemoveDocument = data => ({
    type: SUCCESS_IN_REMOVE_DOCUMENT,
    data
});

export const startDeleteDocument  = () => ({
    type: START_DELETE_DOCUMENT
});

export const successDeleteDocument = data => ({
    type: SUCCESS_IN_DELETE_DOCUMENT,
    data
});


export const startRestoreDocument  = () => ({
    type: START_RESTORE_DOCUMENT
});

export const successRestoreDocument = data => ({
    type: SUCCESS_IN_RESTORE_DOCUMENT,
    data
});

export const failedRestoreDocument = data => ({
    type: ERROR_IN_RESTORE_DOCUMENT,
    data
});


export const updateDocumentPercentage = data => ({
  type: UPDATE_DOCUMENT_DOWNALOD_PERCENTAGE,
  data
});

export const downloadComplete = () => ({
  type: DOCUMENT_DOWNLOAD_SUCCESS
});

export const downloadFailed = () => ({
  type: DOCUMENT_DOWNLOAD_FAILED
});

export const updateprintPercentage = data => ({
  type: UPDATE_DOCUMENT_PRINT_PERCENTAGE,
  data
});

export const printComplete = data => ({
  type: DOCUMENT_PRINT_SUCCESS,
  data
});

export const printFailed = () => ({
  type: DOCUMENT_PRINT_FAILED
});


export const fetchAllDocuments = (userId, data) => dispatch => {
  getAllDocuments(userId).then(data => {
      if (data.success) {
        for (const i in data.items) {
          data.items[i].selected = false;
        }
        dispatch(fetchedAllDocuments(data));
      } else {
        message.error('Failed to create document');
      }
  }, test => {
    if (test.errors && test.errors.length > 0) {
      message.error(test.errors[0].message);
    } else {
      dispatch(failedCreateDocument('Error while fetch all documents.'));
    }
  });
};

export const fetchRemovedDocuments = (userId, data) => dispatch => {
  getRemovedDocuments(userId).then(data => {
      if (data.success) {
        dispatch(fetchedAllRemovedDocuments(data));
      } else {
        message.error('Failed to create document');
      }
  }, test => {
    if (test.errors && test.errors.length > 0) {
      message.error(test.errors[0].message);
    } else {
      dispatch(failedCreateDocument('Error while fetch removed documents.'));
    }
  });
};

export const removeDocumentItem = (id, intMsg) => dispatch => {
  dispatch(startRemoveDocument());
  removeDocument(id).then(data => {
      if (data.success) {
        dispatch(successRemoveDocument({id}));
        message.success(intMsg({id: 'Documents.documentDeleteSuccess'}));
      } else {
        message.error(intMsg({id: 'Documents.documentDeleteFailed'}));
      }
  }, test => {
    if (test.errors && test.errors.length > 0) {
      message.error(intMsg({id: 'Documents.documentDeleteError'}));
    } else {
      message.error(intMsg({id: 'Documents.documentDeleteError'}));
      dispatch(failedCreateDocument('Error while remove documents.'));
    }
  });
};

export const restoreDocumentItem = (userId, restoreId, intMsg) => dispatch => {
  dispatch(startRestoreDocument());
  restoreDocument(userId, restoreId).then(data => {
      if (data.success) {
        dispatch(successRestoreDocument(data.items));
        message.success(intMsg({id: 'Documents.documentRestoreSuccess'}));
      } else {
        message.error(intMsg({id: 'Documents.documentRestoreFailed'}));
      }
  }, test => {
    if (test.errors && test.errors.length > 0) {
      message.error(intMsg({id: 'Documents.documentRestoreError'}));
    } else {
      message.error(intMsg({id: 'Documents.documentRestoreError'}));
      dispatch(failedRestoreDocument('Error while restore documents.'));
    }
  });
};

export const deleteDocumentItem = (id, intMsg) => dispatch => {
  dispatch(startDeleteDocument());
  deleteDocument(id).then(data => {
      if (data.success) {
        dispatch(successDeleteDocument({id}));
        message.success(intMsg({id: 'Documents.documentDeleteSuccess'}));
      } else {
        message.error(intMsg({id: 'Documents.documentDeleteFailed'}));
      }
  }, test => {
    if (test.errors && test.errors.length > 0) {
      message.error(intMsg({id: 'Documents.documentDeleteError'}));
    } else {
      message.error(intMsg({id: 'Documents.documentDeleteError'}));
      dispatch(failedCreateDocument('Error while delete documents.'));
    }
  });
};

export const createDocument = (userId, data, intMsg) => dispatch => {
  dispatch(startCreatingDocument());
  createDocumentAPI(userId, data).then(data => {
      if (data && data.success) {
        dispatch(successCreateDocument(data.item));
        message.success(intMsg({id: 'Documents.documentCreateSuccess'}));
      } else {
        dispatch(failedCreateDocument(intMsg({id: 'Documents.documentCreateFailed'})));
        message.error(intMsg({id: 'Documents.documentCreateFailed'}));
      }
  }, test => {
    if (test.errors && test.errors.length > 0) {
      message.error(intMsg({id: 'Documents.documentCreateError'}));
      dispatch(failedCreateDocument(test.errors[0].message));
    } else {
      message.error(intMsg({id: 'Documents.documentCreateError'}));
      dispatch(failedCreateDocument(intMsg({id: 'Documents.documentCreateError'})));
    }
  });
};

export const updatingDocument = (id, data, intMsg) => dispatch => {
  dispatch(startUpdatingDocument());
  updateDocument(id, data).then(data => {
      if (data.success) {
        dispatch(successUpdateDocument(data.item));
        message.success(intMsg({id: 'Documents.documentUpdateSuccess'}));
      } else {
        message.error(intMsg({id: 'Documents.documentUpdateFailed'}));
      }
  }, test => {
    if (test.errors && test.errors.length > 0) {
      message.error(intMsg({id: 'Documents.documentUpdateError'}));
      dispatch(failedUpdateDocument(test.errors[0].message));
    } else {
      dispatch(failedUpdateDocument(intMsg({id: 'Documents.documentUpdateError'})));
    }
  });
};

export const dowloadDocument = (id, fileName, contentType, intMsg) => dispatch => {
  const CancelToken = axios.CancelToken;

  let cancel;

  return axios(`${API_URL}/document/${id}/download`, {
    method: 'GET',
    responseType: 'blob',
    headers: {
      Authorization: `Bearer ${sessionToken || getToken()}`
    },
    /*eslint-disable */
    cancelToken: new CancelToken(function executor  (c) {
      cancel = c;
    }),
    onDownloadProgress: progressEvent => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);

        dispatch(updateDocumentPercentage({num: percentCompleted, cancel}));
    }
  })
  .then(response => {
      const file = new Blob([response.data], {type: contentType});

      saveAs(file, fileName);
      dispatch(downloadComplete());
      message.success(intMsg({id: 'Documents.documentDownloadSuccess'}));
  })
  .catch(error => {
      dispatch(downloadFailed(intMsg({id: 'Documents.documentDownloadFailed'})));
  });
};


export const printDocument = (id, fileName, contentType, intMsg) => dispatch => {

  const CancelToken = axios.CancelToken;

  let cancel;

  return axios(`${API_URL}/document/${id}/download`, {
    method: 'GET',
    responseType: 'blob',
    headers: {
      Authorization: `Bearer ${sessionToken}`
    },
    /*eslint-disable */
    cancelToken: new CancelToken(function executor  (c) {
      cancel = c;
    }),
    onDownloadProgress: progressEvent => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);

        dispatch(updateprintPercentage({num: percentCompleted, cancel}));
    }
  })
  .then(response => {
      let type;
      if (contentType.includes('image')) {
        type = 'image';
      }
      if (contentType.includes('pdf')) {
        type = 'pdf';
      }
      blobToBase64(new Blob([response.data], {type: type}), (base64) => {
        print({
          printable: encodeURI(base64.replace('data:pdf;base64,', '')), 
          type, 
          base64: true,
          onError: (err) => {
            console.log(err);
          }
        });
        dispatch(printComplete(null));
      });
      
  })
  .catch(error => {
      dispatch(printFailed(intMsg({id: 'Documents.printFailed'})));
  });
};

const blobToBase64 = (blob, callback) => {
  var reader = new FileReader();
  reader.onload = function() {
      var dataUrl = reader.result;
      callback(dataUrl);
  };
  reader.readAsDataURL(blob);
};

export const saveDocumentSearchItem = (title, itemId, userId, isSuccessful) => dispatch => {
    saveItem(title, itemId, userId, isSuccessful);
};

