import {
  START_UPLOADING_IMAGE,
  UPLOADING_IMAGE_SUCCESS,
  UPLOADING_IMAGE_FAILED,
  CLEAR_MSG_VALUE,
  FETCH_NEWSFEED_LIST,
  FETCH_NEWSFEED_SUCCESS,
  FETCH_NEWSFEED_FAILED,
  FETCHING_NEWSFEED_ITEM,
  FETCHING_NEWSFEED_ITEM_SUCCESS,
  FETCHING_NEWSFEED_ITEM_FAILED,
  LIKE_NEWSFEED_ITEM,
  UNLIKE_NEWSFEED_ITEM,
  REMOVE_NEWSFEED_ITEM,
  CLEAR_NEWSFEED_LISTING,
  START_UPADATING_NEWSFEED,
  UPDATE_NEWSFEED_SUCCESS,
  UPDATE_NEWSFEED_FAILED,
  FETCH_ADMINTOOL_NEWSLIST,
  FETCH_ADMINTOOL_NEWSLIST_SUCCESS,
  FETCH_ADMINTOOL_NEWSLIST_FAILED,
  FETCH_ADMIN_USER_LIST,
  FETCH_ADMIN_USER_LIST_FAILED,
  FETCH_ADMIN_USER_LIST_SUCCESS,
  FETCH_ADMINTOOLS_REMOVED_NEWSLIST_START,
  FETCH_ADMINTOOLS_REMOVED_NEWSLIST_SUCCESS,
  FETCH_ADMINTOOLS_REMOVED_NEWSLIST_FAILED,
  START_RESTORE_NEWSFEED,
  SUCCESS_RESTORE_NEWSFEED,
  FAILED_RESTORE_NEWSFEED,
  START_DELETE_NEWSFEED,
  SUCCESS_DELETE_NEWSFEED,
  FAILED_DELETE_NEWSFEED,
  START_FETCH_ANALYTIC_DATA,
  FETCH_ANALYTIC_DATA_SUCCESS,
  FETCH_ANALYTIC_DATA_FAILED,
  START_GET_FETCH_ANALYTIC_DETAIL,
  GET_FETCH_ANALYTIC_DETAIL_SUCCESS,
  GET_FETCH_ANALYTIC_DETAIL_FAILED
} from './adminTool.action';

const getInitialState = () => ({
  newsFeeds: [],
  isLoading: false,
  isUploading: false,
  isDeleting: false,
  isRestoring: false,
  msg: null,
  newsFeedMsg: null,
  isFetching: false,
  isAnalyticChartDetailsLoading: false,
  analyticChartDetails: null,
  isNewsFeedLoaded: false,
  newsFeed: null,
  analyticData: null,
  isAnalyticFetchingData: false,
  isAdminNewsFeedLoaded: false,
  adminNewsFeeds: [],
  isAdminNewsListFetching: false,
  adminRemovedNewsFeeds: [],
  isAdminRemovedNewsfeedFetching: false,
  isAdminRemovedNewsFeedLoaded: false,
  adminUserList: [],
  isAdminUserListFetching: false,
  isAdminUserListLoaded: false
});

export default {
  [CLEAR_MSG_VALUE]: (state = getInitialState(), action) => {
    return {
      ...state,
      newsFeedMsg: null
    };
  },
  [CLEAR_NEWSFEED_LISTING]: (state = getInitialState(), action) => {
    return {
      ...state,
      newsFeedMsg: null,
      newsFeeds: [],
      isNewsFeedLoaded: false
    };
  },
  [START_UPLOADING_IMAGE]: (state = getInitialState(), action) => {
    return {
      ...state,
      newsFeedMsg: null,
      isUploading: true
    };
  },
  [UPLOADING_IMAGE_SUCCESS]: (state = getInitialState(), action) => {
    return {
      ...state,
      newsFeedMsg: 'NEWSFEED_CREATED_SUCCESSFULLY',
      isUploading: false,
      adminNewsFeeds: ([action.data, ...state.adminNewsFeeds]).sort((a, b) => b.date - a.date),
      newsFeeds: ([action.data, ...state.newsFeeds])
    };
  },
  [UPLOADING_IMAGE_FAILED]: (state = getInitialState(), action) => {
    return {
      ...state,
      newsFeedMsg: null,
      isUploading: false
    };
  },
  [FETCH_ADMINTOOL_NEWSLIST]: (state = getInitialState(), action) => {
    return {
      ...state,
      newsFeedMsg: null,
      isAdminNewsListFetching: true,
      isAdminNewsFeedLoaded: false,
      adminNewsFeeds: []
    };
  },
  [FETCH_ADMINTOOL_NEWSLIST_SUCCESS]: (state = getInitialState(), action) => {
    return {
      ...state,
      newsFeedMsg: null,
      isAdminNewsListFetching: false,
      isAdminNewsFeedLoaded: true,
      adminNewsFeeds: action.data || []
    };
  },
  [FETCH_ADMINTOOL_NEWSLIST_FAILED]: (state = getInitialState(), action) => {
    return {
      ...state,
      newsFeedMsg: null,
      isAdminNewsListFetching: false,
      isAdminNewsFeedLoaded: false,
      adminNewsFeeds: []
    };
  },
  [FETCH_ADMIN_USER_LIST]: (state = getInitialState(), action) => {
    return {
      ...state,
      isAdminUserListLoaded: false,
      isAdminUserListFetching: true,
      adminUserList: []
    };
  },
  [FETCH_ADMIN_USER_LIST_SUCCESS]: (state = getInitialState(), action) => {
    return {
      ...state,
      isAdminUserListLoaded: true,
      isAdminUserListFetching: false,
      adminUserList: action.data || []
    };
  },
  [FETCH_ADMIN_USER_LIST_FAILED]: (state = getInitialState(), action) => {
    return {
      ...state,
      isAdminUserListLoaded: false,
      isAdminUserListFetching: false,
      adminUserList: []
    };
  },
  [FETCH_NEWSFEED_LIST]: (state = getInitialState(), action) => {
    return {
      ...state,
      newsFeedMsg: null,
      isFetching: true
    };
  },
  [FETCH_NEWSFEED_SUCCESS]: (state = getInitialState(), action) => {
    return {
      ...state,
      isFetching: false,
      newsFeeds: action.data,
      isNewsFeedLoaded: true
    };
  },
  [FETCH_NEWSFEED_FAILED]: (state = getInitialState(), action) => {
    return {
      ...state,
      newsFeeds: [],
      isFetching: false
    };
  },

  [FETCHING_NEWSFEED_ITEM]: (state = getInitialState(), action) => {
    return {
      ...state,
      newsFeed: null,
      isFetching: true
    };
  },
  [FETCHING_NEWSFEED_ITEM_SUCCESS]: (state = getInitialState(), action) => {
    return {
      ...state,
      newsFeed: action.data,
      isFetching: false
    };
  },
  [FETCHING_NEWSFEED_ITEM_FAILED]: (state = getInitialState(), action) => {
    return {
      ...state,
      newsFeed: null,
      isFetching: false
    };
  },

  [START_FETCH_ANALYTIC_DATA]: (state = getInitialState(), action) => {
    return {
      ...state,
      analyticData: null,
      isAnalyticFetchingData: true
    };
  },
  [FETCH_ANALYTIC_DATA_SUCCESS]: (state = getInitialState(), action) => {
    return {
      ...state,
      analyticData: action.data,
      isAnalyticFetchingData: false
    };
  },
  [FETCH_ANALYTIC_DATA_FAILED]: (state = getInitialState(), action) => {
    return {
      ...state,
      analyticData: null,
      isAnalyticFetchingData: false
    };
  },
  [START_GET_FETCH_ANALYTIC_DETAIL]: (state = getInitialState()) => {
    return {
      ...state,
      isAnalyticChartDetailsLoading: true
    };
  },
  [GET_FETCH_ANALYTIC_DETAIL_SUCCESS]: (state = getInitialState(), action) => {
    return {
      ...state,
      isAnalyticChartDetailsLoading: false,
      analyticChartDetails: action.data
    };
  },
  [GET_FETCH_ANALYTIC_DETAIL_FAILED]: (state = getInitialState(), action) => {
    return {
      ...state,
      isAnalyticChartDetailsLoading: false,
      analyticChartDetails: null
    };
  },

  [LIKE_NEWSFEED_ITEM]: (state = getInitialState(), action) => {
    const { newsFeeds } = state;
    const index = newsFeeds.findIndex(x => x.id === action.data.NewsId);

    if (index > -1) {
      newsFeeds[index].likes += 1;
      newsFeeds[index].isLiked = true;
    }
    return {
      ...state,
      newsFeeds
    };
  },
  [UNLIKE_NEWSFEED_ITEM]: (state = getInitialState(), action) => {
    const { newsFeeds } = state;
    const index = newsFeeds.findIndex(x => x.id === action.data.NewsId);

    if (index > -1) {
      newsFeeds[index].likes -= 1;
      newsFeeds[index].isLiked = false;
    }
    return {
      ...state,
      newsFeeds
    };
  },
  [REMOVE_NEWSFEED_ITEM]: (state = getInitialState(), action) => {
    const { adminNewsFeeds, newsFeeds, adminRemovedNewsFeeds } = state;
    const index = adminNewsFeeds.findIndex(x => x.id === action.id);
    const indexNewsFeed = newsFeeds.findIndex(x => x.id === action.id);

    if (index > -1) {
      adminRemovedNewsFeeds.unshift(adminNewsFeeds[index]);
      adminNewsFeeds.splice(index, 1);
    }
    if (indexNewsFeed > -1) {
      newsFeeds.splice(indexNewsFeed, 1);
    }
    return {
      ...state,
      adminNewsFeeds,
      newsFeeds,
      adminRemovedNewsFeeds
    };
  },
  [START_UPADATING_NEWSFEED]: (state = getInitialState(), action) => {
    return {
      ...state,
      isUploading: true,
      newsFeedMsg: null
    };
  },
  [UPDATE_NEWSFEED_SUCCESS]: (state = getInitialState(), action) => {
    const { adminNewsFeeds, newsFeeds } = state;
    const index = adminNewsFeeds.findIndex(x => x.id === action.data.id);

    if (index > -1) {
      adminNewsFeeds[index] = {...adminNewsFeeds[index], ...action.data};
    }

    const indexNewsFeed = newsFeeds.findIndex(x => x.id === action.data.id);

    if (indexNewsFeed > -1) {
      newsFeeds[indexNewsFeed] = {...newsFeeds[indexNewsFeed], ...action.data};
    }
    return {
      ...state,
      isUploading: false,
      newsFeedMsg: 'UPDATE_NEWS_FEED_SUCCESS',
      adminNewsFeeds,
      newsFeeds
    };
  },
  [UPDATE_NEWSFEED_FAILED]: (state = getInitialState(), action) => {
    return {
      ...state,
      newsFeedMsg: null,
      isUploading: false
    };
  },
  [FETCH_ADMINTOOLS_REMOVED_NEWSLIST_START]: (state = getInitialState(), action) => {
    return {
      ...state,
      newsFeedMsg: null,
      isAdminRemovedNewsfeedFetching: true,
      isAdminRemovedNewsFeedLoaded: false,
      adminRemovedNewsFeeds: []
    };
  },
  [FETCH_ADMINTOOLS_REMOVED_NEWSLIST_SUCCESS]: (state = getInitialState(), action) => {
    return {
      ...state,
      newsFeedMsg: null,
      isAdminRemovedNewsfeedFetching: false,
      isAdminRemovedNewsFeedLoaded: true,
      adminRemovedNewsFeeds: action.data || []
    };
  },
  [FETCH_ADMINTOOLS_REMOVED_NEWSLIST_FAILED]: (state = getInitialState(), action) => {
    return {
      ...state,
      newsFeedMsg: null,
      isAdminRemovedNewsfeedFetching: false,
      isAdminRemovedNewsFeedLoaded: false,
      adminRemovedNewsFeeds: []
    };
  },
  [START_RESTORE_NEWSFEED]: (state = getInitialState(), action) => {
    return {
      ...state,
      newsFeedMsg: null,
      isRestoring: true
    };
  },
  [SUCCESS_RESTORE_NEWSFEED]: (state = getInitialState(), action) => {
    const { adminNewsFeeds, adminRemovedNewsFeeds, newsFeeds } = state;
    const index = adminRemovedNewsFeeds.findIndex(x => x.id === action.data.id);

    adminNewsFeeds.push(action.data);
    newsFeeds.push(action.data);
    if (index > -1) {
      adminRemovedNewsFeeds.splice(index, 1);
    }
    return {
      ...state,
      newsFeedMsg: 'SUCCESS_IN_RESTORE_NEWSFEED',
      isRestoring: false,
      adminNewsFeeds,
      adminRemovedNewsFeeds,
      newsFeeds
    };
  },
  [FAILED_RESTORE_NEWSFEED]: (state = getInitialState(), action) => {
    return {
      ...state,
      newsFeedMsg: 'ERROR_IN_RESTORE_NEWSFEED',
      isRestoring: false
    };
  },
  [START_DELETE_NEWSFEED]: (state = getInitialState(), action) => {
    return {
      ...state,
      newsFeedMsg: null,
      isDeleting: true
    };
  },
  [SUCCESS_DELETE_NEWSFEED]: (state = getInitialState(), action) => {
    const { adminRemovedNewsFeeds } = state;

    const index = adminRemovedNewsFeeds.findIndex(x => x.id === action.data.id);

    if (index > -1) {
      adminRemovedNewsFeeds.splice(index, 1);
    }
    return {
      ...state,
      newsFeedMsg: 'SUCCESS_IN_DELETE_NEWSFEED',
      isDeleting: false,
      adminRemovedNewsFeeds
    };
  },
  [FAILED_DELETE_NEWSFEED]: (state = getInitialState(), action) => {
    return {
      ...state,
      newsFeedMsg: 'ERROR_IN_DELETE_NEWSFEED',
      isDeleting: false
    };
  }
};

export const defaultAdminTool = getInitialState();
