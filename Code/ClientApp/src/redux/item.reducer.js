import { SET_ACTIVE_ITEM } from './item.action';

const getInitialState = () => null;

export default {
  [SET_ACTIVE_ITEM]: (state = getInitialState(), action) => action.data
};

export const defaultItem = getInitialState();
