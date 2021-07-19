/**
 * @param content: string - Html content which one you need to convert into normal string.
 * @param maxSize: number - Size of string. Default maxSize = 200
 * @return string - return normal string based on given maxSize.
 */
export const getShortDescription = (content, maxSize = 200) => {
  const stringText = [];
  const regex = /(<([^>]+)>)/ig;
  const regextForParagraph = /.*?(?=\<p\>).*?(?=\<\/p\>)/ig;

  // Get App <p> tag from content
  content.replace(regextForParagraph, (match, g1) => {
    const str = match.replace(regex, '');

    stringText.push({ value: str, length: str.length});
  });

  if (stringText.length === 0) {
    content = content.replace(/\n/g, '');
    content.replace(regextForParagraph, (match, g1) => {
      const str = match.replace(regex, '');

      stringText.push({ value: str, length: str.length});
    });
  }


  let lastTrimmedString = (stringText.length > 0) ? stringText[0].value : '';

  if (lastTrimmedString.length > maxSize) {
    lastTrimmedString = `${lastTrimmedString.substr(0, maxSize)}`;
    lastTrimmedString = `${lastTrimmedString.substr(0, lastTrimmedString.lastIndexOf(' '))}...`;
  }
  return lastTrimmedString;
};
