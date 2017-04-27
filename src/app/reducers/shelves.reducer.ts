import { squirrelReducer, SquirrelActions, SquirrelState } from '@flowup/squirrel';
import { Shelf } from '../shared/models/shelf.model';
import { Action } from '@ngrx/store';

const modelName = 'SHELVES';
const generic = squirrelReducer(modelName);
const shelvesAdditionalActions = {
  API_ADD_BOOK: `${modelName}_API_ADD_BOOK`,
  API_REMOVE_BOOK: `${modelName}_API_REMOVE_BOOK`,
  ADD_BOOK: `${modelName}_ADD_BOOK`,
  REMOVE_BOOK: `${modelName}_REMOVE_BOOK`,
  API_COPY: `${modelName}_API_COPY`,
  COPY: `${modelName}_COPY`
};

export const shelvesActions = new SquirrelActions(modelName, shelvesAdditionalActions);

export function shelvesReducer(state: SquirrelState<Shelf> = {data: [], error: null, loading: false},
                               action: Action) {
  switch (action.type) {
    case shelvesAdditionalActions.API_ADD_BOOK:
      return Object.assign({}, state, {loading: true});
    case shelvesAdditionalActions.API_REMOVE_BOOK:
      return Object.assign({}, state, {loading: true});
    case shelvesAdditionalActions.API_COPY:
      return Object.assign({}, state, {loading: true});
    case shelvesAdditionalActions.COPY:
      return Object.assign({}, state, {loading: false});
    default:
      return generic(state, action);
  }
}
