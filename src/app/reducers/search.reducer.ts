import { Action } from '@ngrx/store';

import { squirrelReducer, SquirrelActions, SquirrelState } from '@flowup/squirrel';
import { GRSearchBook } from '../shared/models/goodreadsBook.model';


const modelName = 'SEARCH';
const generic = squirrelReducer(modelName);
const searchAdditionalActions = {
  DESTROY: `${modelName}_DESTROY`
};

export const searchActions = new SquirrelActions(modelName, searchAdditionalActions);

export function searchReducer(state: SquirrelState<GRSearchBook> = {data: [], error: null, loading: false},
                              action: Action) {
  switch (action.type) {
    case searchAdditionalActions.DESTROY:
      return {data: [], error: null, loading: false};
    case 'CLEAR':
      return state;
    default:
      return generic(state, action);
  }
}
