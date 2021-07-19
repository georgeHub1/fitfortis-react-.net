import { getAdminToolNewsList, updateNewsFeed, deleteNewsFeed, uploadAdminToolImage, createAdminTool, getNewsList, getNewsDetail, likeNewsFeed, unLikeNewsFeed, getAdminUserList, getAdminToolRecyclebinNewsList, restoreNewsFeed, inactiveNewsFeed, saveItem, fetchAnalytics, getAnalyticDetailsData } from '../backendServices/adminTool';
import { message } from 'antd';
import { setActiveItem } from './item.action';
import { getUserLanguage } from './auth.selector';

export const START_UPLOADING_IMAGE = 'START_UPLOADING_IMAGE';
export const UPLOADING_IMAGE_SUCCESS = 'UPLOADING_IMAGE_SUCCESS';
export const UPLOADING_IMAGE_FAILED = 'UPLOADING_IMAGE_FAILED';

export const START_UPADATING_NEWSFEED = 'START_UPADATING_NEWSFEED';
export const UPDATE_NEWSFEED_SUCCESS = 'UPDATE_NEWSFEED_SUCCESS';
export const UPDATE_NEWSFEED_FAILED = 'UPDATE_NEWSFEED_FAILED';

export const CLEAR_MSG_VALUE = 'CLEAR_MSG_VALUE';

export const FETCH_NEWSFEED_LIST = 'FETCH_NEWSFEED_LIST';
export const FETCH_NEWSFEED_SUCCESS = 'FETCH_NEWSFEED_SUCCESS';
export const FETCH_NEWSFEED_FAILED = 'FETCH_NEWSFEED_FAILED';


export const FETCH_ADMINTOOL_NEWSLIST = 'FETCH_ADMINTOOL_NEWSLIST';
export const FETCH_ADMINTOOL_NEWSLIST_SUCCESS = 'FETCH_ADMINTOOL_NEWSLIST_SUCCESS';
export const FETCH_ADMINTOOL_NEWSLIST_FAILED = 'FETCH_ADMINTOOL_NEWSLIST_FAILED';


export const FETCHING_NEWSFEED_ITEM = 'FETCHING_NEWSFEED_ITEM';
export const FETCHING_NEWSFEED_ITEM_SUCCESS = 'FETCHING_NEWSFEED_ITEM_SUCCESS';
export const FETCHING_NEWSFEED_ITEM_FAILED = 'FETCHING_NEWSFEED_ITEM_FAILED';

export const LIKE_NEWSFEED_ITEM = 'LIKE_NEWSFEED_ITEM';
export const UNLIKE_NEWSFEED_ITEM = 'UNLIKE_NEWSFEED_ITEM';

export const REMOVE_NEWSFEED_ITEM = 'REMOVE_NEWSFEED_ITEM';
export const CLEAR_NEWSFEED_LISTING = 'CLEAR_NEWSFEED_LISTING';

export const FETCH_ADMIN_USER_LIST = 'FETCH_ADMIN_USER_LIST';
export const FETCH_ADMIN_USER_LIST_FAILED = 'FETCH_ADMIN_USER_LIST_FAILED';
export const FETCH_ADMIN_USER_LIST_SUCCESS = 'FETCH_ADMIN_USER_LIST_SUCCESS';

export const FETCH_ADMINTOOLS_REMOVED_NEWSLIST_START = 'FETCH_ADMINTOOLS_REMOVED_NEWSLIST_START';
export const FETCH_ADMINTOOLS_REMOVED_NEWSLIST_SUCCESS = 'FETCH_ADMINTOOLS_REMOVED_NEWSLIST_SUCCESS';
export const FETCH_ADMINTOOLS_REMOVED_NEWSLIST_FAILED = 'FETCH_ADMINTOOLS_REMOVED_NEWSLIST_FAILED';

export const START_RESTORE_NEWSFEED = 'START_RESTORE_NEWSFEED';
export const SUCCESS_RESTORE_NEWSFEED = 'SUCCESS_RESTORE_NEWSFEED';
export const FAILED_RESTORE_NEWSFEED = 'FAILED_RESTORE_NEWSFEED';

export const START_DELETE_NEWSFEED = 'START_DELETE_NEWSFEED';
export const SUCCESS_DELETE_NEWSFEED = 'SUCCESS_DELETE_NEWSFEED';
export const FAILED_DELETE_NEWSFEED = 'FAILED_DELETE_NEWSFEED';

export const START_FETCH_ANALYTIC_DATA = 'START_FETCH_ANALYTIC_DATA';
export const FETCH_ANALYTIC_DATA_SUCCESS = 'FETCH_ANALYTIC_DATA_SUCCESS';
export const FETCH_ANALYTIC_DATA_FAILED = 'FETCH_ANALYTIC_DATA_FAILED';

export const START_GET_FETCH_ANALYTIC_DETAIL = 'START_GET_FETCH_ANALYTIC_DETAIL';
export const GET_FETCH_ANALYTIC_DETAIL_SUCCESS = 'GET_FETCH_ANALYTIC_DETAIL_SUCCESS';
export const GET_FETCH_ANALYTIC_DETAIL_FAILED = 'GET_FETCH_ANALYTIC_DETAIL_FAILED';

export const clearMessage = () => ({
  type: CLEAR_MSG_VALUE
});

export const clearNewsFeedList = () => ({
  type: CLEAR_NEWSFEED_LISTING
});

export const clearMessageValue = () => dispatch => dispatch(clearMessage());

export const startUploadImage = () => ({
  type: START_UPLOADING_IMAGE
});

export const errorUploadImage = err => ({
  type: UPLOADING_IMAGE_FAILED,
  err
});

export const successUploadImage = data => ({
  type: UPLOADING_IMAGE_SUCCESS,
  data
});

export const startFetchingNewsFeed = () => ({
  type: FETCH_NEWSFEED_LIST
});

export const fetchingNewsFeedSuccess = data => ({
  type: FETCH_NEWSFEED_SUCCESS,
  data
});

export const fetchingNewsFeedFailed = () => ({
  type: FETCH_NEWSFEED_FAILED
});


export const startFetchNewsFeedItem = () => ({
  type: FETCHING_NEWSFEED_ITEM
});

export const fetchNewsFeedItemSuccess = data => ({
  type: FETCHING_NEWSFEED_ITEM_SUCCESS,
  data
});

export const fetchNewsFeedItemFailed = () => ({
  type: FETCHING_NEWSFEED_ITEM_FAILED
});

export const startFetchAnalyticsData = () => ({
  type: START_FETCH_ANALYTIC_DATA
});

export const fetchAnalyticsDataSuccess = data => ({
  type: FETCH_ANALYTIC_DATA_SUCCESS,
  data
});

export const fetchAnalyticsDataFailed = () => ({
  type: FETCH_ANALYTIC_DATA_FAILED
});

export const setLikeNewsFeed = data => ({
  type: LIKE_NEWSFEED_ITEM,
  data
});

export const setUnLikeNewsFeed = data => ({
  type: UNLIKE_NEWSFEED_ITEM,
  data
});


export const removeNewsFeedItemFromList = id => ({
  type: REMOVE_NEWSFEED_ITEM,
  id
});


export const startUpdateingNewsFeed = () => ({
  type: START_UPADATING_NEWSFEED
});

export const updatingNewsFeedSuccess = data => ({
  type: UPDATE_NEWSFEED_SUCCESS,
  data
});

export const updatingNewsFeedError = () => ({
  type: UPDATE_NEWSFEED_FAILED
});


export const startFetchingAdminToolList = () => ({
  type: FETCH_ADMINTOOL_NEWSLIST
});

export const fetchtingAdminToolListFailed = () => ({
  type: FETCHING_NEWSFEED_ITEM_FAILED
});

export const fetchtingAdminToolListSuccess = data => ({
  type: FETCH_ADMINTOOL_NEWSLIST_SUCCESS,
  data
});

export const fetchingAdminUserList = () => ({
  type: FETCH_ADMIN_USER_LIST
});

export const fetchtingAdminUserListFailed = () => ({
  type: FETCH_ADMIN_USER_LIST_FAILED
});

export const fetchtingAdminUserListSuccess = data => ({
  type: FETCH_ADMIN_USER_LIST_SUCCESS,
  data
});

export const startFetchingAdminToolsRemovedList = () => ({
  type: FETCH_ADMINTOOLS_REMOVED_NEWSLIST_START
});

export const fetchtingAdminToolsRemovedListSuccess = data => ({
  type: FETCH_ADMINTOOLS_REMOVED_NEWSLIST_SUCCESS,
  data
});

export const fetchtingAdminToolsRemovedListFailed = err => ({
  type: FETCH_ADMINTOOLS_REMOVED_NEWSLIST_FAILED,
  err
});

export const startRestoreNewsfeed = () => ({
  type: START_RESTORE_NEWSFEED
});

export const successRestoreNewsfeed = data => ({
  type: SUCCESS_RESTORE_NEWSFEED,
  data
});

export const failedRestoreNewsfeed = err => ({
  type: FAILED_RESTORE_NEWSFEED,
  err
});

export const startDeleteNewsfeed = () => ({
  type: START_DELETE_NEWSFEED
});

export const successDeleteNewsfeed = data => ({
  type: SUCCESS_DELETE_NEWSFEED,
  data
});

export const failedDeleteNewsfeed = err => ({
  type: FAILED_DELETE_NEWSFEED,
  err
});

export const startGetFetchDEtails = () => ({
  type: START_GET_FETCH_ANALYTIC_DETAIL
});
export const successGetAnalyticDetail = data => ({
  type: GET_FETCH_ANALYTIC_DETAIL_SUCCESS,
  data
});
export const failedGetAnalyticDetail = err => ({
  type: GET_FETCH_ANALYTIC_DETAIL_FAILED,
  err
});

export const fetchNewsFeedListing = language => (dispatch, getState) => {
  try {
    const state = getState();
    const lang = getUserLanguage(state);

    dispatch(startFetchingNewsFeed());
    getNewsList(lang).then(res => {
      if (res.success) {
        const items = res.items || [];
        const filter = items.filter(x => x.title !== '');

        dispatch(fetchingNewsFeedSuccess(filter));
      }
    }).catch(err => {
      message.error('Error while fetch newsfeed details');
      dispatch(fetchingNewsFeedFailed());
    });
  } catch (e) {
    message.error('Error while fetch newsfeed details');
  }
};

export const fetchAdminToolNewsFeedListing = () => dispatch => {
  try {
    dispatch(startFetchingAdminToolList());
    getAdminToolNewsList().then(res => {
      if (res.success) {
        const items = res.items || [];
        const filter = items.filter(x => x.title !== '');

        dispatch(fetchtingAdminToolListSuccess(filter));
      } else {
        dispatch(fetchtingAdminToolListFailed());
      }
    }).catch(err => {
      message.error('Error while fetch newsfeed details');
      dispatch(fetchtingAdminToolListFailed());
    });
  } catch (e) {
    message.error('Error while fetch newsfeed details');
  }
};

export const fetchAdminToolsRemovedNewsFeedListing = () => dispatch => {
  try {
    dispatch(startFetchingAdminToolsRemovedList());
    getAdminToolRecyclebinNewsList().then(res => {
      if (res.success) {
        dispatch(fetchtingAdminToolsRemovedListSuccess(res.items));
      } else {
        dispatch(fetchtingAdminToolsRemovedListFailed());
      }
    }).catch(err => {
      message.error('Error while fetch newsfeed details');
      dispatch(fetchtingAdminToolsRemovedListFailed());
    });
  } catch (e) {
    message.error('Error while fetch newsfeed details');
  }
};

export const fetchAdminUserListing = () => dispatch => {
  try {
    dispatch(fetchingAdminUserList());
    getAdminUserList().then(res => {
      if (res.success) {
        const items = res.items || [];

        dispatch(fetchtingAdminUserListSuccess(items));
      } else {
        dispatch(fetchtingAdminUserListFailed());
      }
    }).catch(err => {
      message.error('Error while fetch newsfeed details');
      dispatch(fetchtingAdminUserListFailed());
    });
  } catch (e) {
    message.error('Error while fetch newsfeed details');
  }
};

export const fetchNewsFeedItemDetails = (newId, userId, language) => dispatch => {
  try {
    dispatch(startFetchNewsFeedItem());
    getNewsDetail(newId, userId, language).then(res => {
      if (res.success) {
        dispatch(fetchNewsFeedItemSuccess(res.item));
        dispatch(setActiveItem(res.item));
      }
    }).catch(err => {
      dispatch(fetchNewsFeedItemFailed());
    });
  } catch (e) {
    // console.log(e);
  }
};
export const fetchAnalyticsDetails = language => dispatch => {
  try {
    dispatch(startFetchAnalyticsData());
    fetchAnalytics(language).then(res => {
      if (res.success) {
        dispatch(fetchAnalyticsDataSuccess(res.items));
      }
    }).catch(err => {
      dispatch(fetchAnalyticsDataFailed());
    });
  } catch (e) {
    // console.log(e);
  }
};
export const getAnalyticDetails = language => dispatch => {
  try {
    dispatch(startGetFetchDEtails());
    getAnalyticDetailsData(language).then(res => {
      if (res.success) {
        res.items.map(item => {
          item.analyticData.map(el => {
            el.dateTime = new Date(el.date).setMilliseconds(0);
            delete el.date;
            return el;
          });
          item.analyticData.sort((a, b) => a.dateTime - b.dateTime);
          if (item.analyticData.length > 0) {
            const data1 = item.analyticData[0];
            const data2 = item.analyticData[item.analyticData.length - 1];

            item.analyticData.push({
              dateTime: data1.dateTime,
              value: data1.value,
              analyticId: data1.analyticId,
              id: data1.id,
              leftAdditionalMetric: data1.value
            });
            item.analyticData.push({
              dateTime: data1.dateTime - 172800000,
              analyticId: data1.analyticId,
              id: data1.id,
              leftAdditionalMetric: data1.value
            });
            item.analyticData.push({
              dateTime: data2.dateTime,
              value: data2.value,
              analyticId: data2.analyticId,
              id: data2.id,
              rightAdditionalMetric: data2.value
            });
            item.analyticData.push({
              dateTime: data2.dateTime + 172800000,
              analyticId: data2.analyticId,
              id: data2.id,
              rightAdditionalMetric: data2.value
            });
          }
          return item;
        });

        dispatch(successGetAnalyticDetail(res.items));
      }
    }).catch(err => {
      dispatch(failedGetAnalyticDetail());
    });
  } catch (error) {
    // console.log(error);
  }
};

const getLanguageKey = (language, data) => {
  if (language.includes('uk')) {
    return {
      TitleUkUa: data.title,
      DescriptionUkUa: data.description,
      TitleBgBg: '',
      DescriptionBgBg: '',
      TitleEnUs: '',
      DescriptionEnUs: '',
      TitleEn: '',
      DescriptionEn: ''
    };
  } else if (language.includes('bg')) {
    return {
      TitleBgBg: data.title,
      DescriptionBgBg: data.description,
      TitleEnUs: '',
      DescriptionEnUs: '',
      TitleUkUa: '',
      DescriptionUkUa: '',
      TitleEn: '',
      DescriptionEn: ''
    };
  } else if (language.includes('en-us')) {
    return {
      TitleEnUs: data.title,
      DescriptionEnUs: data.description,
      TitleUkUa: '',
      DescriptionUkUa: '',
      TitleBgBg: '',
      DescriptionBgBg: '',
      TitleEn: '',
      DescriptionEn: ''
    };
  }
  return {
    TitleEn: data.title,
    DescriptionEn: data.description,
    TitleUkUa: '',
    DescriptionUkUa: '',
    TitleBgBg: '',
    DescriptionBgBg: '',
    TitleEnUs: '',
    DescriptionEnUs: ''
  };
};

export const uploadImage = (language, base64, name, obj, translate, locale, date) => dispatch => {
  try {
    dispatch(startUploadImage());
    if (base64) {
      uploadAdminToolImage(base64, name).then(res => {
        const newObj = {
          ...getLanguageKey(language, obj),
          Date: date,
          Language: language,
          PictureId: res.id,
          PictureUrl: res.fileUrl
        };

        createAdminTool(newObj).then(res => {
          message.success(translate({id: 'AdminToolsNewsfeedList.newsFeedCreated'}));
          const newObj = {
            ...res.item,
            id: res.item.id,
            title: obj.title,
            description: obj.description,
            date: date.toISOString(),
            pictureId: res.item.pictureId,
            pictureUrl: res.item.pictureUrl
          };

          dispatch(successUploadImage(newObj));
        }).catch(err => {
          message.success(translate({id: 'AdminToolsNewsfeedList.newsFeedCreateFail'}));
          dispatch(errorUploadImage(err));
        });
      }).catch(err => {
        message.success(translate({id: 'AdminToolsNewsfeedList.newsFeedCreateFail'}));
        dispatch(errorUploadImage(err));
      });
    } else {
      const newObj = {
        ...getLanguageKey(language, obj),
        Date: date,
        Language: language,
        PictureId: '',
        PictureUrl: ''
      };

      createAdminTool(newObj).then(res => {
        message.success(translate({id: 'AdminToolsNewsfeedList.newsFeedCreated'}));
        const newObj = {
          ...res.item,
          id: res.item.id,
          title: obj.title,
          description: obj.description,
          date: date.toISOString(),
          pictureId: '',
          pictureUrl: ''
        };

        dispatch(successUploadImage(newObj));
      }).catch(err => {
        message.success(translate({id: 'AdminToolsNewsfeedList.newsFeedCreateFail'}));
        dispatch(errorUploadImage(err));
      });
    }
  } catch (e) {
    message.success(translate({id: 'AdminToolsNewsfeedList.newsFeedCreateFail'}));
    dispatch(errorUploadImage(e));
  }
};

export const updateNewsItem = (prevNewsFeedObj, language, base64, name, obj, translate, locale, isImageChanged, date) => dispatch => {
  try {
    dispatch(startUpdateingNewsFeed());
    if (isImageChanged) {
      uploadAdminToolImage(base64, name).then(res => {
        const newObj = {
          ...getLanguageKey(language, obj),
          Date: date,
          Language: language,
          PictureId: res.id,
          PictureUrl: res.fileUrl
        };

        updateNewsFeed(prevNewsFeedObj.id, newObj).then(res => {
          message.success(translate({id: 'AdminToolsNewsfeedList.newsFeedUpdateMessage'}));
          const newObj = {
            ...res.item,
            id: res.item.id,
            title: obj.title,
            description: obj.description,
            pictureId: res.item.pictureId,
            pictureUrl: res.item.pictureUrl,
            likes: 0,
            shareLink: '',
            isLiked: false
          };

          dispatch(updatingNewsFeedSuccess(newObj));
        }).catch(err => {
          message.success(translate({id: 'AdminToolsNewsfeedList.newsFeedUpdateErrorMessage'}));
          dispatch(updatingNewsFeedError(err));
        });
      }).catch(err => {
        message.success(translate({id: 'AdminToolsNewsfeedList.newsFeedUpdateErrorMessage'}));
        dispatch(updatingNewsFeedError(err));
      });
    } else {
      const newObj = {
        ...getLanguageKey(language, obj),
        Date: date,
        Language: language,
        PictureUrl: prevNewsFeedObj.pictureUrl || '',
        PictureId : prevNewsFeedObj.pictureId || ''
      };

      updateNewsFeed(prevNewsFeedObj.id, newObj).then(res => {
        message.success(translate({id: 'AdminToolsNewsfeedList.newsFeedUpdateMessage'}));
        const newObj = {
          ...res.item,
          id: res.item.id,
          title: obj.title,
          description: obj.description,
          pictureId: res.item.pictureId,
          pictureUrl: res.item.pictureUrl,
          likes: 0,
          shareLink: '',
          isLiked: false
        };

        dispatch(updatingNewsFeedSuccess(newObj));
      }).catch(err => {
        message.success(translate({id: 'AdminToolsNewsfeedList.newsFeedUpdateErrorMessage'}));
        dispatch(updatingNewsFeedError(err));
      });
    }
  } catch (e) {
    message.success(translate({id: 'AdminToolsNewsfeedList.newsFeedUpdateErrorMessage'}));
    dispatch(updatingNewsFeedError(e));
  }
};


export const likeNewsFeedItem = (userId, newId) => dispatch => {
  try {
    const obj = {
      NewsId: newId,
      UserId: userId
    };

    dispatch(setLikeNewsFeed(obj));
    likeNewsFeed(obj).then(res => {
      // console.log(res);
    }).catch(err => {
      // console.log(err);
    });
  } catch (e) {
    // console.log(e);
  }
};

export const unLikeNewsFeedItem = (userId, newId) => dispatch => {
  try {
    const obj = {
      NewsId: newId,
      UserId: userId
    };

    dispatch(setUnLikeNewsFeed(obj));
    unLikeNewsFeed(newId, userId).then(res => {
      // console.log(res);
    }).catch(err => {
      // console.log(err);
    });
  } catch (e) {
    // console.log(e);
  }
};

export const removeNewsFeedItem = (newId, translate) => dispatch => {
  try {
    dispatch(removeNewsFeedItemFromList(newId));
    message.success(translate({id: 'AdminToolsNewsfeedList.deleteNewsFeedMessage'}));
    inactiveNewsFeed(newId).then(res => {
      // console.log(res, 'del;ete');
    }).catch(err => {
      // console.log(err);
    });
  } catch (e) {
    // console.log(e);
  }
};

export const deleteRecyclebinNewsFeedItem = (id, translate) => dispatch => {
  try {
    dispatch(startDeleteNewsfeed());
    deleteNewsFeed(id).then(res => {
      dispatch(successDeleteNewsfeed({ id }));
      message.success(translate({id: 'AdminToolsNewsfeedList.deleteNewsFeedMessage'}));
    }).catch(err => {
      dispatch(failedDeleteNewsfeed(err));
      message.success(translate({id: 'AdminToolsNewsfeedList.deleteNewsFeedFailedMessage'}));
    });
  } catch (e) {
    dispatch(failedDeleteNewsfeed(e));
    message.success(translate({id: 'AdminToolsNewsfeedList.deleteNewsFeedFailedMessage'}));
  }
};

export const restoreRecyclebinNewsFeedItem = (data, translate) => dispatch => {
  try {
    dispatch(startRestoreNewsfeed());
    restoreNewsFeed(data).then(res => {
      const data = res.items[0];
      const newObj = {
        ...data,
        title: data.titleEnUs || data.titleUkUa || data.titleBgBg,
        description: data.descriptionEnUs || data.descriptionUkUa || data.descriptionBgBg
      };

      dispatch(successRestoreNewsfeed(newObj));
      message.success(translate({id: 'AdminToolsNewsfeedList.newsFeedRestoreSuccess'}));
    }).catch(err => {
      dispatch(failedRestoreNewsfeed(err));
      message.success(translate({id: 'AdminToolsNewsfeedList.newsFeedRestoreFailed'}));
    });
  } catch (e) {
    dispatch(failedRestoreNewsfeed(e));
    message.success(translate({id: 'AdminToolsNewsfeedList.newsFeedRestoreFailed'}));
  }
};

export const saveNewsSearchItem = (title, itemId, userId, isSuccessful) => dispatch => {
    saveItem(title, itemId, userId, isSuccessful);
};

