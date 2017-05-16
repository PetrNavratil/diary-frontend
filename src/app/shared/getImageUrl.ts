import { environment } from '../../environments/environment';

/**
 * Creates valid image url
 * @param url
 * @returns {string}
 */
export function getImageUrl(url: string): string {
  // check if url is from 3rd party
  if(url.indexOf('http') !== -1){
    return url;
  } else {
    return `${environment.apiUrl}/${url}`;
  }
}