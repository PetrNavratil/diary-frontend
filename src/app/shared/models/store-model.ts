import { GRSearchBook, GRBook } from './goodreadsBook.model';
export interface StoreModel<T> {
  error?: Error,
  data: T[]
}

export interface AppState {
  search: StoreModel<GRSearchBook>
  bookDetail: StoreModel<GRBook>
}