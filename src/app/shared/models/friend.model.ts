import { Shelf } from './shelf.model';
import { Book } from './book.model';
export interface Friend{
  id: number;
  avatar: string;
  username: string;
  firstName: string;
  lastName: string;
  since: string;
  booksCount: number;
  shelvesCount: number;
  shelves: Shelf;
  books: Book
}