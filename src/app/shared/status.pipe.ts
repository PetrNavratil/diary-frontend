import { Pipe } from '@angular/core';
import { BookStatus } from '../models/book-status.enum';

@Pipe({name: 'bookStatus'})
export class BookStatusPipe {

  transform(value: number): string {
    switch (value) {
      case BookStatus.NOT_READ:
        return 'Nepřečteno';
      case BookStatus.TO_READ:
        return 'Chci přečíst';
      case BookStatus.READING:
        return 'Čtu';
      case BookStatus.READ:
        return 'Přečteno';
      case BookStatus.ALL:
        return 'Vše';
      default:
        return 'Nepřečteno';
    }
  }
}