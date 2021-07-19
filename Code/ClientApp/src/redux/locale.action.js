export const LOCALE_SET = 'LOCALE_SET';

export const localeSet = language => ({
  type: LOCALE_SET,
  language
});

export const setLocale = language => dispatch => {
  localStorage.language = language;
  dispatch(localeSet(language));
  return Promise.resolve();
};
