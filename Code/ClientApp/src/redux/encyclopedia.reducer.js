import {
  EMPTY_ENCYCLOPEDIA_LIST,
  UPDATE_PREV_SEARCH,
  DELETE_PREV_SEARCH,
  FETCH_ENCYCLOPEDIA,
  SUCCESS_IN_ENCYCLOPEDIA,
  ERROR_IN_ENCYCLOPEDIA,
  FETCH_PREV_SEARCH,
  ERROR_PREV_SEARCH,
  SUCCESS_PREV_SEARCH,
  FETCH_ENCYCLOPEDIA_DETAIL,
  SUCCESS_IN_ENCYCLOPEDIA_DETAIL,
  ERROR_IN_ENCYCLOPEDIA_DETAIL,
  EMPTY_ENCYCLOPEDIA_LIST_MEDICINES,
  UPDATE_PREV_SEARCH_MEDICINES,
  DELETE_PREV_SEARCH_MEDICINES,
  FETCH_ENCYCLOPEDIA_MEDICINES,
  SUCCESS_IN_ENCYCLOPEDIA_MEDICINES,
  ERROR_IN_ENCYCLOPEDIA_MEDICINES,
  FETCH_PREV_SEARCH_MEDICINES,
  ERROR_PREV_SEARCH_MEDICINES,
  ENCYCLOPEDIA_CLICK_TAB,
  SUCCESS_PREV_SEARCH_MEDICINES,
  FETCH_ENCYCLOPEDIA_DETAIL_MEDICINES,
  SUCCESS_IN_ENCYCLOPEDIA_DETAIL_MEDICINES,
  ERROR_IN_ENCYCLOPEDIA_DETAIL_MEDICINES
} from './encyclopedia.action';
const getInitialState = () => ({
  prevSearches: [],
  list:[],
  selectedTab: 'Topics',
  total: 0,
  isLoading: false,
  limit: 1000,
  page: 1,
  encyclopedia: {
    title: '',
    synonyms: '',
    conciseDescription: ''
  },
  isSearchItemLoaded: false,
  isSearchItemLoading: false,
  isHistoryLoaded: false,
  medicinePrevSearches: [],
  medicineList:[],
  medicineTotal: 0,
  isMedicineLoading: false,
  medicineLimit: 1000,
  medicinePage: 1,
  encyclopediaMedicine: {
    title: '',
    synonyms: '',
    conciseDescription: ''
  },
  isSearchItemMedicineLoaded: false,
  isSearchItemMedicineLoading: false,
  isHistoryMedicineLoaded: false
});

export default {
  [EMPTY_ENCYCLOPEDIA_LIST]: (state = getInitialState(), action) => {
    return {
      ...state,
      list: [],
      page: 1,
      total: 0,
      isLoading: false
    };
  },
  [ENCYCLOPEDIA_CLICK_TAB]: (state = getInitialState(), action) => {
    return {
      ...state,
      selectedTab: action.data
    };
  },
  [UPDATE_PREV_SEARCH]: (state = getInitialState(), action) => {
    return {
      ...state,
      prevSearches: [...action.search, ...state.prevSearches]
    };
  },
  [DELETE_PREV_SEARCH]: (state = getInitialState(), action) => {
    return {
      ...state,
      prevSearches: action.search
    };
  },
  [FETCH_ENCYCLOPEDIA]: (state, action) => {
    return {
      ...state,
      page: 1,
      total: 0,
      list: [],
      isSearchItemLoading: true
    };
  },
  [SUCCESS_IN_ENCYCLOPEDIA]: (state, {data}) => {
    return {
      ...state,
      page: (data) ? ++state.page : 1,
      total: (data) ? data.total : 0,
      isSearchItemLoading: false,
      list: data ? data.items : [],
      isSearchItemLoaded: true
    };
  },
  [ERROR_IN_ENCYCLOPEDIA]: (state, action) => {
    return {
      ...state,
      page: 1,
      total: 0,
      list: [],
      isLoading: false
    };
  },
  [FETCH_PREV_SEARCH] : (state, {data}) => {
    return {
      ...state,
      isLoading: true
    };
  },
  [SUCCESS_PREV_SEARCH] : (state, {data}) => {
    return {
      ...state,
      isLoading: false,
      prevSearches: data ? data.items : [],
      isHistoryLoaded: true
    };
  },
  [ERROR_PREV_SEARCH] : (state, {data}) => {
    return {
      ...state,
      isLoading: false,
      prevSearches: []
    };
  },
  [FETCH_ENCYCLOPEDIA_DETAIL] : (state, {data}) => {
    return {
      ...state,
      isLoading: true
    };
  },
  [SUCCESS_IN_ENCYCLOPEDIA_DETAIL] : (state, {data}) => {
    return {
      ...state,
      isLoading: false,
      encyclopedia: data ? data.item : null
    };
  },
  [ERROR_IN_ENCYCLOPEDIA_DETAIL] : (state, {data}) => {
    return {
      ...state,
      isLoading: false,
      encyclopedia: {
        title: '',
        synonyms: '',
        conciseDescription: ''
      }
    };
  },
  [EMPTY_ENCYCLOPEDIA_LIST_MEDICINES]: (state = getInitialState(), action) => {
    return {
      ...state,
      medicineList: [],
      medicinePage: 1,
      medicineTotal: 0,
      isMedicineLoading: false
    };
  },
  [UPDATE_PREV_SEARCH_MEDICINES]: (state = getInitialState(), action) => {
    return {
      ...state,
      medicinePrevSearches: [...action.search, ...state.medicinePrevSearches]
    };
  },
  [DELETE_PREV_SEARCH_MEDICINES]: (state = getInitialState(), action) => {
    return {
      ...state,
      medicinePrevSearches: action.search
    };
  },
  [FETCH_ENCYCLOPEDIA_MEDICINES]: (state, action) => {
    return {
      ...state,
      medicinePage: 1,
      medicineTotal: 0,
      medicineList: [],
      isSearchItemMedicineLoading: true
    };
  },
  [SUCCESS_IN_ENCYCLOPEDIA_MEDICINES]: (state, {data}) => {
    return {
      ...state,
      medicinePage: (data) ? ++state.medicinePage : 1,
      medicineTotal: (data) ? data.total : 0,
      isSearchItemMedicineLoading: false,
      medicineList: data ? data.items : [],
      isSearchItemMedicineLoaded: true
    };
  },
  [ERROR_IN_ENCYCLOPEDIA_MEDICINES]: (state, action) => {
    return {
      ...state,
      medicinePage: 1,
      medicineTotal: 0,
      medicineList: [],
      isMedicineLoading: false
    };
  },
  [FETCH_PREV_SEARCH_MEDICINES] : (state, {data}) => {
    return {
      ...state,
      isMedicineLoading: true
    };
  },
  [SUCCESS_PREV_SEARCH_MEDICINES] : (state, {data}) => {
    return {
      ...state,
      isMedicineLoading: false,
      medicinePrevSearches: data ? data.items : [],
      isHistoryMedicineLoaded: true
    };
  },
  [ERROR_PREV_SEARCH_MEDICINES] : (state, {data}) => {
    return {
      ...state,
      isMedicineLoading: false,
      medicinePrevSearches: []
    };
  },
  [FETCH_ENCYCLOPEDIA_DETAIL_MEDICINES] : (state, {data}) => {
    return {
      ...state,
      isMedicineLoading: true
    };
  },
  [SUCCESS_IN_ENCYCLOPEDIA_DETAIL_MEDICINES] : (state, {data}) => {
    return {
      ...state,
      isMedicineLoading: false,
      encyclopediaMedicine: data ? data.item : null
    };
  },
  [ERROR_IN_ENCYCLOPEDIA_DETAIL_MEDICINES] : (state, {data}) => {
    return {
      ...state,
      isMedicineLoading: false,
      encyclopediaMedicine: {
        title: '',
        synonyms: '',
        conciseDescription: ''
      }
    };
  }
};

export const defaultEncyclopedia = getInitialState();
