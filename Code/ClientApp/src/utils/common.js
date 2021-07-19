export const createReducer = handlers =>
  (state = null, action) => {
    if (handlers[action.type]) {
      return handlers[action.type](state, action);
    }
    return state;
  };

export const formatDate = date => {
  var monthNames = [ // TODO: need to be localized
    'Jan', 'Feb', 'Mar',
    'Apr', 'May', 'Jun', 'Jul',
    'Aug', 'Sept', 'Oct',
    'Nov', 'Dec'
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return `${ monthNames[monthIndex] } ${ day }, ${ year }`;
};

// TODO need simplify this function
export const getQueryVariable = (variable, url) => {
  if (!url) return '';
  const [, queryString] = url.split('?');
  const vars = queryString.split('&');

  for (let i = 0; i < vars.length; i++) {
    // eslint-disable-next-line no-div-regex
    const pair = vars[i].split(/=(.+)/);

    if (decodeURIComponent(pair[0]) === variable) {
      return decodeURIComponent(pair[1]);
    }
  }
};

export function base64StringtoFile (base64String, filename) {
  const  arr = base64String.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);

  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type: mime});
}

export const arrayBufferToBase64 = buffer => {
  var binary = '';
  var bytes = [].slice.call(new Uint8Array(buffer));

  bytes.forEach(b => binary += String.fromCharCode(b));

  return window.btoa(binary);
};


export function validateWordCount (stringData, maxSize = 350) {
  if (stringData.length > maxSize) {
    stringData = `${stringData.substr(0, maxSize)}`;
    stringData = `${stringData.substr(0, stringData.lastIndexOf(' '))}...`;
  }
  return stringData;
}
