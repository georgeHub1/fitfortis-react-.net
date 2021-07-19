export const getAccountInfo = state => state.profile.account;
export const getUserId = state => getAccountInfo(state).userId;
export const getUserLanguage = state => state.locale.language;
