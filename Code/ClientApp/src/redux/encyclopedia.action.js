import { message } from 'antd';
import {
  getEncyclopedia,
  saveItem,
  getHistory,
  getDetails,
  deleteHistory,
  deleteAllHistory,
  getEncyclopediaMedicine,
  saveItemEncyclopediaMedicine,
  getDetailsEncyclopediaMedicine,
  getHistoryEncyclopediaMedicine,
  deleteMedicineHistory,
  deleteAllMedicineHistory
 } from '../backendServices/encyclopedia';
import { setActiveItem } from './item.action';
import { getUserLanguage } from './auth.selector';
import uuid from 'uuid';

export const FETCH_PREV_SEARCH = 'FETCH_PREV_SEARCH';
export const ERROR_PREV_SEARCH = 'ERROR_PREV_SEARCH';
export const SUCCESS_PREV_SEARCH = 'SUCCESS_PREV_SEARCH';
export const UPDATE_PREV_SEARCH = 'UPDATE_PREV_SEARCH';
export const DELETE_PREV_SEARCH = 'DELETE_PREV_SEARCH';

export const FETCH_ENCYCLOPEDIA = 'FETCH_ENCYCLOPEDIA';
export const SUCCESS_IN_ENCYCLOPEDIA = 'SUCCESS_IN_ENCYCLOPEDIA';
export const ERROR_IN_ENCYCLOPEDIA = 'ERROR_IN_ENCYCLOPEDIA';

export const FETCH_ENCYCLOPEDIA_DETAIL = 'FETCH_ENCYCLOPEDIA_DETAIL';
export const SUCCESS_IN_ENCYCLOPEDIA_DETAIL = 'SUCCESS_IN_ENCYCLOPEDIA_DETAIL';
export const ERROR_IN_ENCYCLOPEDIA_DETAIL = 'ERROR_IN_ENCYCLOPEDIA_DETAIL';
export const EMPTY_ENCYCLOPEDIA_LIST = 'EMPTY_ENCYCLOPEDIA_LIST';

export const FETCH_ENCYCLOPEDIA_MEDICINES = 'FETCH_ENCYCLOPEDIA_MEDICINES';
export const SUCCESS_IN_ENCYCLOPEDIA_MEDICINES = 'SUCCESS_IN_ENCYCLOPEDIA_MEDICINES';
export const ERROR_IN_ENCYCLOPEDIA_MEDICINES = 'ERROR_IN_ENCYCLOPEDIA_MEDICINES';

export const FETCH_ENCYCLOPEDIA_DETAIL_MEDICINES = 'FETCH_ENCYCLOPEDIA_DETAIL_MEDICINES';
export const SUCCESS_IN_ENCYCLOPEDIA_DETAIL_MEDICINES = 'SUCCESS_IN_ENCYCLOPEDIA_DETAIL_MEDICINES';
export const ERROR_IN_ENCYCLOPEDIA_DETAIL_MEDICINES = 'ERROR_IN_ENCYCLOPEDIA_DETAIL_MEDICINES';
export const EMPTY_ENCYCLOPEDIA_LIST_MEDICINES = 'EMPTY_ENCYCLOPEDIA_LIST_MEDICINES';

export const FETCH_PREV_SEARCH_MEDICINES = 'FETCH_PREV_SEARCH_MEDICINES';
export const ERROR_PREV_SEARCH_MEDICINES = 'ERROR_PREV_SEARCH_MEDICINES';
export const SUCCESS_PREV_SEARCH_MEDICINES = 'SUCCESS_PREV_SEARCH_MEDICINES';
export const UPDATE_PREV_SEARCH_MEDICINES = 'UPDATE_PREV_SEARCH_MEDICINES';
export const DELETE_PREV_SEARCH_MEDICINES = 'DELETE_PREV_SEARCH_MEDICINES';

export const ENCYCLOPEDIA_CLICK_TAB = 'ENCYCLOPEDIA_CLICK_TAB';

export const encyclopediaTab = data => ({
  type: ENCYCLOPEDIA_CLICK_TAB,
  data
});

export const fetchingEncyclopediaSearchHistory  = () => ({
    type: FETCH_PREV_SEARCH
});
export const fetchingEncyclopediaHistorySuccess  = data => ({
    type: SUCCESS_PREV_SEARCH,
    data
});
export const fetchingEncyclopediaHistoryError  = () => ({
    type: ERROR_PREV_SEARCH,
    data: []
});

export const updatePrevSearch = search => ({
  type: UPDATE_PREV_SEARCH,
  search
});
export const deletePrevSearch = search => ({
  type: DELETE_PREV_SEARCH,
  search
});


export const fetchingEncyclopedia  = () => ({
    type: FETCH_ENCYCLOPEDIA
});

export const emptyEncyclopedia = () => ({
  type: EMPTY_ENCYCLOPEDIA_LIST
});

export const successEncyclopedia = data => ({
    type: SUCCESS_IN_ENCYCLOPEDIA,
    data
});

export const failedEncyclopedia = err => ({
    type: ERROR_IN_ENCYCLOPEDIA,
    err
});


export const fetchingEncyclopediaDetails  = () => ({
    type: FETCH_ENCYCLOPEDIA_DETAIL
});

export const successEncyclopediaDetails = data => ({
    type: SUCCESS_IN_ENCYCLOPEDIA_DETAIL,
    data
});

export const failedEncyclopediaDetails = err => ({
    type: ERROR_IN_ENCYCLOPEDIA_DETAIL,
    err
});

export const fetchingEncyclopediaMedicineSearchHistory  = () => ({
    type: FETCH_PREV_SEARCH_MEDICINES
});
export const fetchingEncyclopediaMedicineHistorySuccess  = data => ({
    type: SUCCESS_PREV_SEARCH_MEDICINES,
    data
});
export const fetchingEncyclopediaMedicineHistoryError  = () => ({
    type: ERROR_PREV_SEARCH_MEDICINES,
    data: []
});

export const updateMedicinePrevSearch = search => ({
  type: UPDATE_PREV_SEARCH_MEDICINES,
  search
});
export const deleteMedicinePrevSearch = search => ({
  type: DELETE_PREV_SEARCH_MEDICINES,
  search
});


export const fetchingEncyclopediaMedicine  = () => ({
    type: FETCH_ENCYCLOPEDIA_MEDICINES
});

export const emptyEncyclopediaMedicine = () => ({
  type: EMPTY_ENCYCLOPEDIA_LIST_MEDICINES
});

export const successEncyclopediaMedicine = data => ({
    type: SUCCESS_IN_ENCYCLOPEDIA_MEDICINES,
    data
});

export const failedEncyclopediaMedicine = err => ({
    type: ERROR_IN_ENCYCLOPEDIA_MEDICINES,
    err
});


export const fetchingEncyclopediaMedicineDetails  = () => ({
    type: FETCH_ENCYCLOPEDIA_DETAIL_MEDICINES
});

export const successEncyclopediaMedicineDetails = data => ({
    type: SUCCESS_IN_ENCYCLOPEDIA_DETAIL_MEDICINES,
    data
});

export const failedEncyclopediaMedicineDetails = err => ({
    type: ERROR_IN_ENCYCLOPEDIA_DETAIL_MEDICINES,
    err
});

export  const encyclopediaTabClick = value => dispatch => {
  dispatch(encyclopediaTab(value));
};

export const fetchEncyclopedia = () => (dispatch, getState) => {
    dispatch(fetchingEncyclopedia());
    const state = getState();
    const language = getUserLanguage(state);

    getEncyclopedia(language.includes('uk') ? 'uk-ua' : language).then(data => {
        if (data.hasOwnProperty('items')) {
          for (const i in data.items) {
            data.items[i].uniqueId = uuid.v4();
          }
        }
        const finalData = data.items.filter(x => { return x.title && x.title !== ''; });

        finalData.sort((a, b) => {
          if (a.title.trim() > b.title.trim()) {
            return 1;
          } else if (b.title.trim() > a.title.trim()) {
            return -1;
          }
          return 0;
        });
        data.items = finalData;
        dispatch(successEncyclopedia(data));
    }, test => {
      message.error(test);
      dispatch(failedEncyclopedia(test));
    });
};

/* Save search item */
export const saveEncyclopediaSearchItem = (title, itemId, userId, isSuccessful) => dispatch => {
    saveItem(title, itemId, userId, isSuccessful);
};


export const fetchSearchHistory = userId => dispatch => {
    dispatch(fetchingEncyclopediaSearchHistory());
    getHistory(userId).then(data => {
        const items = data.items.filter(x => x.isSuccessful === true);

        data.items = items;
        dispatch(fetchingEncyclopediaHistorySuccess(data));
    }, test => {
      message.error(test);
      dispatch(fetchingEncyclopediaHistoryError(test));
    });
};


export const fetchEncyclopediaDetail = (id, language) => dispatch => {
    dispatch(fetchingEncyclopediaDetails());
    getDetails(id, language).then(data => {
      if (data.success) {
        dispatch(setActiveItem(data.item));
        dispatch(successEncyclopediaDetails(data));
      } else {
        message.error('Item not found');
        dispatch(failedEncyclopediaDetails({}));
      }
    }, test => {
      message.error(test);
      dispatch(failedEncyclopediaDetails(test));
    });
};

export const removeEncyclopedia = id => dispatch => {
    deleteHistory(id);
};

export const removeAllEncyclopedia = userId => dispatch => {
    deleteAllHistory(userId);
};


export const fetchEncyclopediaMedicine = () => (dispatch, getState) => {
  dispatch(fetchingEncyclopediaMedicine());
  const state = getState();
    const language = getUserLanguage(state);

  getEncyclopediaMedicine(language.includes('uk') ? 'uk-ua' : language)
  .then(data => {
      if (data && data.items && data.success) {
        if (data.hasOwnProperty('items')) {
          for (const i in data.items) {
            data.items[i].uniqueId = uuid.v4();
          }
        }
        const finalData = data.items.filter(x => { return x.title && x.title !== ''; });

        finalData.sort((a, b) => {
          if (a.title.trim() > b.title.trim()) {
            return 1;
          } else if (b.title.trim() > a.title.trim()) {
            return -1;
          }
          return 0;
        });
        data.items = finalData;
        dispatch(successEncyclopediaMedicine(data));
      }
  }, test => {
    message.error(test);
    dispatch(failedEncyclopediaMedicine(test));
  });
};

/* Save search item */
export const saveEncyclopediaMedicineSearchItem = (title, itemId, userId, isSuccessful) => dispatch => {
  saveItemEncyclopediaMedicine(title, itemId, userId, isSuccessful);
};


export const fetchMedicineSearchHistory = userId => dispatch => {
  dispatch(fetchingEncyclopediaMedicineSearchHistory());
  getHistoryEncyclopediaMedicine(userId).then(data => {
      const items = data.items.filter(x => x.isSuccessful === true);

      data.items = items;
      dispatch(fetchingEncyclopediaMedicineHistorySuccess(data));
  }, test => {
    message.error(test);
    dispatch(fetchingEncyclopediaMedicineHistoryError(test));
  });
};


export const fetchEncyclopediaMedicineDetail = (id, language) => dispatch => {
  dispatch(fetchingEncyclopediaMedicineDetails());
  getDetailsEncyclopediaMedicine(id, language).then(data => {
    if (data.success) {
      dispatch(setActiveItem(data.item));
      dispatch(successEncyclopediaMedicineDetails(data));
    } else {
      message.error('Item not found');
      dispatch(failedEncyclopediaMedicineDetails({}));
    }
  }, test => {
    message.error(test);
    dispatch(failedEncyclopediaMedicineDetails(test));
  });
};

export const removeEncyclopediaMedicine = id => dispatch => {
  deleteMedicineHistory(id);
};

export const removeAllEncyclopediaMedicine = userId => dispatch => {
  deleteAllMedicineHistory(userId);
};
