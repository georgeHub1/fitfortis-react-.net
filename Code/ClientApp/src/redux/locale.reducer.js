import { LOCALE_SET } from './locale.action';
const locale = (state = { language: 'en' }, action = {}) => {
  switch (action.type) {
    case LOCALE_SET:
      return { language: action.language };
    default:
      return state;
  }
};

export default locale;
