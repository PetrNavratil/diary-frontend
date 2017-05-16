import { Pipe } from '@angular/core';
import { BookStatus } from '../models/book-status.enum';

@Pipe({name: 'bookStatus'})
export class BookStatusPipe {

  constructor(){

  }

  transform(value: number): string {
    return `book.${BookStatus[value]}`;
  }
}