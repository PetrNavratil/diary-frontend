import { squirrelReducer, SquirrelActions, SquirrelState } from '@flowup/squirrel';
import { Action } from '@ngrx/store';
import { Book } from '../shared/models/book.model';

const modelName = 'BOOK';
const generic = squirrelReducer(modelName);

const booksAdditionalActions = {
  GET_SINGLE: `${modelName}_API_GET_SINGLE`
};
export const booksActions = new SquirrelActions(modelName, booksAdditionalActions);

export function booksReducer(state: SquirrelState<Book> = {data: [], error: null, loading: false, origin: null},
                            action: Action) {
  switch (action.type) {
    case booksAdditionalActions.GET_SINGLE:
      return Object.assign({}, state, {loading: true});
    default:
      return generic(state, action);
  }
}
