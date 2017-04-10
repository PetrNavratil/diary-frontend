import { Action } from '@ngrx/store';

import { squirrelReducer, SquirrelActions, SquirrelState } from '@flowup/squirrel';
import { GRSearchBook } from '../shared/models/goodreadsBook.model';


const modelName = 'SEARCH';
const generic = squirrelReducer(modelName);
const searchAdditionalActions = {
  DESTROY: `${modelName}_DESTROY`
};

export const searchActions = new SquirrelActions(modelName, searchAdditionalActions);

export function searchReducer(state: SquirrelState<GRSearchBook> = {data: [], error: null, loading: false, origin: null},
                              action: Action) {
  switch (action.type) {
    case searchAdditionalActions.DESTROY:
      return {data: [], error: null, loading: false, origin: null};

    default:
      return generic(state, action);
  }
}
