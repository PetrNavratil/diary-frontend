import { environment } from '../../environments/environment';
export function getImageUrl(url: string): string {
  if(url.indexOf('http') !== -1){
    return url;
  } else {
    return `${environment.apiUrl}/${url}`;
  }
}