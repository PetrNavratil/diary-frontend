import { RequestOptionsArgs, Headers } from '@angular/http';

export function createOptions(): RequestOptionsArgs {
  let options: RequestOptionsArgs = {};
  options.headers = new Headers();
  options.headers.append('Authorization', `Bearer ${localStorage.getItem('id_token')}`);
  return options;
}