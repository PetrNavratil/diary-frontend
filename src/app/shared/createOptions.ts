import { RequestOptionsArgs, Headers } from '@angular/http';

/**
 * Creates options for HTTP request
 * JWT token is appended to the headers
 * @returns {RequestOptionsArgs}
 */
export function createOptions(): RequestOptionsArgs {
  let options: RequestOptionsArgs = {};
  options.headers = new Headers();
  options.headers.append('Authorization', `Bearer ${localStorage.getItem('id_token')}`);
  return options;
}