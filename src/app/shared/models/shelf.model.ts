import { Book } from './book.model';

export interface Shelf {
  id: number;
  name: string;
  visible: boolean;
  books: Book[];
}
