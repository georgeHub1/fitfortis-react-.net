const normalizeMixedDataValue = value => {
  var padding = '000000000000000';

  // Loop over all numeric values in the string and
  // replace them with a value of a fixed-width for
  // both leading (integer) and trailing (decimal)
  // padded zeroes.
  value = value.replace(
    /(\d+)((\.\d+)+)?/g,
    ($0, integer, decimal, $3) => {
      // If this numeric value has "multiple"
      // decimal portions, then the complexity
      // is too high for this simple approach -
      // just return the padded integer.
      if (decimal !== $3) {
        return (padding.slice(integer.length) + integer + decimal);
      }
      decimal = (decimal || '.0');
      return (padding.slice(integer.length) + integer + decimal + padding.slice(decimal.length));
    }
  );
  return (value);
};

export const sortingData = (data, key) => {
  return data.sort((a, b) => {
    // Normalize the file names with fixed-
    // width numeric data.
    var aMixed = normalizeMixedDataValue(a[key]);
    var bMixed = normalizeMixedDataValue(b[key]);

    return aMixed.localeCompare(bMixed);
    // return (aMixed < bMixed ? -1 : 1);
  });
};

export const arrayBufferToBase64 = buffer => {
  var binary = '';
  var bytes = [].slice.call(new Uint8Array(buffer));

  bytes.forEach(b => binary += String.fromCharCode(b));

  return window.btoa(binary);
};

export const  base64ToBlob = (b64Data, contentType, sliceSize) => {
  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, {type: contentType});
};
