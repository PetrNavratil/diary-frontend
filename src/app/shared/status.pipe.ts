import { Pipe } from '@angular/core';
import { BookStatus } from '../models/book-status.enum';

@Pipe({name: 'bookStatus'})
export class BookStatusPipe {

  /**
   * Returns path to the translate json based on passed BookStatus
   * @param value
   * @returns {string}
   */
  transform(value: number): string {
    return `book.${BookStatus[value]}`;
  }
}