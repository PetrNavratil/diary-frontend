import { BookStatus } from './book-status.enum';
import { EducationModel } from './education.model';

export interface Book {
  id: number;
  title: string;
  author: string;
  imageUrl: string;
  status?: BookStatus;
  inBooks?: boolean;
  educational?: EducationModel;
}
