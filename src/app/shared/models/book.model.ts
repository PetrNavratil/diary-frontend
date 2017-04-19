import { BookStatus } from './book-status.enum';
import { EducationModel } from './education.model';
import { GRBook } from './goodreadsBook.model';
import { GoogleBook } from './googleBook.model';

export interface Book {
  id: number;
  title: string;
  author: string;
  imageUrl: string;
  status?: BookStatus;
  inBooks?: boolean;
  educational?: EducationModel;
}

export interface BookInfo {
  goodReadsBook: GRBook
  googleBook: GoogleBook
}
