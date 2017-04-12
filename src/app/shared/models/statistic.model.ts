import { Book } from './book.model';

export interface Statistic{
  booksCount: number;
  booksRead: number;
  booksReading: number;
  booksToRead: number;
  booksNotRead: number;
  timeSpentReading: number;
  mostlyRead: Book
}