export const SET_ACTIVE_ITEM = 'SET_ACTIVE_ITEM';

export const setActiveItem = data => dispatch => {
  dispatch({
    type: SET_ACTIVE_ITEM,
    data
  });
};
