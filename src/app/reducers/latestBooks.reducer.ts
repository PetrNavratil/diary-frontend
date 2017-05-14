import { squirrelReducer, SquirrelActions, SquirrelState } from '@flowup/squirrel';
import { Book } from '../models/book.model';
import { Action } from '@ngrx/store';
const modelName = 'LATEST_BOOKS';
const generic = squirrelReducer(modelName);

export const latestBooksActions = new SquirrelActions(modelName);

export function latestBooksReducer(state: SquirrelState<Book> = {data: [], error: null, loading: false},
                             action: Action) {
  switch (action.type) {
    case 'CLEAR':
      return state;
    default:
      return generic(state, action);
  }
}
