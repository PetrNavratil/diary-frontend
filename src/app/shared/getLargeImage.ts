/**
 * Creates url for larga img from the goodreads
 * @param url
 * @returns {string}
 */
export function getLargeImage(url: string): string {
  // is it default no cover photo ?
  if (url.indexOf('nophoto') > -1) {
    return url;
  } else {
    // change 'm' or 's' for 'l' to get bigger image
    let myIndex = url.lastIndexOf('/') - 1;
    let newUrl = url.split('').map((char, index) => {
      if (index === myIndex) {
        return 'l';
      } else {
        return char;
      }
    }).join('');
    return newUrl;
  }
}
