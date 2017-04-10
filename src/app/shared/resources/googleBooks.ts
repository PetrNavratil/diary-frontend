import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_ENDPOINT = 'https://www.googleapis.com/books/v1/volumes?q=';
const AUTHOR = 'inauthor:'

@Injectable()
export class GoogleResource {

  constructor(private http: Http) {

  }

  getBooksByAuthor(key: string): Observable<Response> {
    return this.http.get(this.createPath(key));
  }

  createPath(key: string): string {
    return API_ENDPOINT + encodeURI(key);
  }

}
