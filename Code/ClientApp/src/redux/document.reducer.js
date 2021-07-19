import {
  START_CREATE_DOCUMENT,
  SUCCESS_IN_CREATE_DOCUMENT,
  ERROR_IN_CREATE_DOCUMENT,
  FETCHING_ALL_DOCUMENTS,
  FETCHING_ALL_REMOVED_DOCUMENTS,
  START_REMOVE_DOCUMENT,
  SUCCESS_IN_REMOVE_DOCUMENT,
  START_UPDATE_DOCUMENT,
  SUCCESS_IN_UPDATE_DOCUMENT,
  ERROR_IN_UPDATE_DOCUMENT,
  START_DELETE_DOCUMENT,
  SUCCESS_IN_DELETE_DOCUMENT,
  START_RESTORE_DOCUMENT,
  SUCCESS_IN_RESTORE_DOCUMENT,
  ERROR_IN_RESTORE_DOCUMENT,
  UPDATE_DOCUMENT_DOWNALOD_PERCENTAGE,
  START_DOWNLOAD_DOCUMENT,
  DOCUMENT_DOWNLOAD_SUCCESS,
  DOCUMENT_DOWNLOAD_FAILED,
  UPDATE_DOCUMENT_PRINT_PERCENTAGE,
  START_PRINT_DOCUMENT,
  DOCUMENT_PRINT_SUCCESS,
  DOCUMENT_PRINT_FAILED
} from './document.action';

const getInitialState = () => ({
  isLoading: false,
  documents: [],
  removedDocuments: [],
  msg: null,
  isAllDocumentLoaded: false,
  isRemovedDocumentLoaded: false,
  isDeleting: false,
  isRestoring: false,
  downloadDocument: {
    percentage: 0,
    inProgress: false,
    cancel: null,
    msg: null
  },
  printDocumentWindow: {
    percentage: 0,
    inProgress: false,
    cancel: null,
    msg: null,
    isLoaded: false,
    base64: null
  }
});

export default {
  [START_CREATE_DOCUMENT]: (state = getInitialState(), action) => {
    return {
      ...state,
      isLoading: true,
      msg: null
    };
  },
  [SUCCESS_IN_CREATE_DOCUMENT]: (state = getInitialState(), action) => {
    const { documents } = state;

    return {
      ...state,
      isLoading: false,
      msg: 'DOCUMENT_CREATE_SUCCESS',
      documents: [action.data, ...documents]
    };
  },
  [ERROR_IN_CREATE_DOCUMENT]: (state = getInitialState(), action) => {
    return {
      ...state,
      isLoading: false,
      msg: 'DOCUMENT_CREATE_FAILED'
    };
  },
  [FETCHING_ALL_DOCUMENTS]: (state = getInitialState(), action) => {
    return {
      ...state,
      msg: null,
      isAllDocumentLoaded: true,
      documents: (action.data && action.data.items) ? action.data.items : []
    };
  },
  [FETCHING_ALL_REMOVED_DOCUMENTS]: (state = getInitialState(), action) => {
    return {
      ...state,
      isRemovedDocumentLoaded: true,
      msg: 'DOCUMENT_CREATE_FAILED',
      removedDocuments: (action.data && action.data.items) ? action.data.items : []
    };
  },
  [START_REMOVE_DOCUMENT]: (state = getInitialState(), action) => {
    return {
      ...state,
      isDeleting: true,
      msg: null
    };
  },
  [SUCCESS_IN_REMOVE_DOCUMENT]: (state = getInitialState(), action) => {
    const { removedDocuments, documents } = state;

    const index = documents.findIndex(x => x.id === action.data.id);

    if (index > -1) {
      removedDocuments.unshift(documents[index]);
      documents.splice(index, 1);
    }
    return {
      ...state,
      isDeleting: false,
      msg: 'DOCUMENT_REMOVED_SUCCESS',
      removedDocuments,
      documents
    };
  },
  [START_DELETE_DOCUMENT]: (state = getInitialState(), action) => {
    return {
      ...state,
      isDeleting: true,
      msg: null
    };
  },
  [SUCCESS_IN_DELETE_DOCUMENT]: (state = getInitialState(), action) => {
    const { removedDocuments } = state;

    const index = removedDocuments.findIndex(x => x.id === action.data.id);

    if (index > -1) {
      removedDocuments.splice(index, 1);
    }
    return {
      ...state,
      isDeleting: false,
      msg: 'DOCUMENT_DELETE_SUCCESS',
      removedDocuments
    };
  },
  [START_UPDATE_DOCUMENT]: (state = getInitialState(), action) => {
    return {
      ...state,
      isLoading: true,
      msg: null
    };
  },
  [SUCCESS_IN_UPDATE_DOCUMENT]: (state = getInitialState(), action) => {
    const { documents } = state;

    const index = documents.findIndex(x => x.id === action.data.id);

    if (index > -1) {
      documents[index] = action.data;
    }
    return {
      ...state,
      isLoading: false,
      msg: 'SUCCESS_IN_UPDATE_DOCUMENT',
      documents
    };
  },
  [ERROR_IN_UPDATE_DOCUMENT]: (state = getInitialState(), action) => {
    return {
      ...state,
      isLoading: false,
      msg: 'ERROR_IN_UPDATE_DOCUMENT'
    };
  },
  [START_RESTORE_DOCUMENT]: (state = getInitialState(), action) => {
    return {
      ...state,
      isRestoring: true,
      msg: null
    };
  },
  [SUCCESS_IN_RESTORE_DOCUMENT]: (state = getInitialState(), action) => {
    const { documents, removedDocuments } = state;

    for (const i in action.data) {
      documents.push(action.data[i]);

      const index = removedDocuments.findIndex(x => x.id === action.data[i].id);

      if (index > -1) {
        removedDocuments.splice(index, 1);
      }
    }
    return {
      ...state,
      isRestoring: false,
      msg: 'SUCCESS_IN_RESTORE_DOCUMENT',
      documents,
      removedDocuments
    };
  },
  [ERROR_IN_RESTORE_DOCUMENT]: (state = getInitialState(), action) => {
    return {
      ...state,
      isRestoring: false,
      msg: 'ERROR_IN_RESTORE_DOCUMENT'
    };
  },
  [UPDATE_DOCUMENT_DOWNALOD_PERCENTAGE]: (state = getInitialState(), action) => {
    return {
      ...state,
      downloadDocument: {
        percentage: action.data.num,
        cancel: action.data.cancel,
        inProgress: true,
        msg: null
      }
    };
  },
  [START_DOWNLOAD_DOCUMENT]: (state = getInitialState(), action) => {
    return {
      ...state,
      downloadDocument: {
        percentage: 0,
        inProgress: true,
        msg: null,
        cancel: null
      }
    };
  },
  [DOCUMENT_DOWNLOAD_SUCCESS]: (state = getInitialState(), action) => {
    return {
      ...state,
      downloadDocument: {
        percentage: 100,
        inProgress: false,
        msg: 'DOWNLOAD_SUCCESS',
        cancel: null
      }
    };
  },
  [DOCUMENT_DOWNLOAD_FAILED]: (state = getInitialState(), action) => {
    return {
      ...state,
      downloadDocument: {
        percentage: 0,
        inProgress: false,
        msg: null,
        cancel: null
      }
    };
  },
  [UPDATE_DOCUMENT_PRINT_PERCENTAGE]: (state = getInitialState(), action) => {
    return {
      ...state,
      printDocumentWindow: {
        percentage: action.data.num,
        cancel: action.data.cancel,
        inProgress: true,
        msg: null,
        base64: null
      }
    };
  },
  [START_PRINT_DOCUMENT]: (state = getInitialState(), action) => {
    return {
      ...state,
      printDocumentWindow: {
        percentage: 0,
        inProgress: true,
        msg: null,
        cancel: null,
        base64: null,
        isLoaded: false
      }
    };
  },
  [DOCUMENT_PRINT_SUCCESS]: (state = getInitialState(), action) => {
    return {
      ...state,
      printDocumentWindow: {
        percentage: 100,
        inProgress: false,
        msg: 'DOWNLOAD_SUCCESS',
        cancel: null,
        base64: action.data,
        isLoaded: true
      }
    };
  },
  [DOCUMENT_PRINT_FAILED]: (state = getInitialState(), action) => {
    return {
      ...state,
      printDocumentWindow: {
        percentage: 0,
        inProgress: false,
        msg: null,
        cancel: null,
        base64: null,
        isLoaded: false
      }
    };
  }
};

export const defaultDocument = getInitialState();
