import { Action } from '@ngrx/store';
import { squirrelReducer, SquirrelActions, SquirrelState } from '@flowup/squirrel';
import { GRBook } from '../shared/models/goodreadsBook.model';


const modelName = 'DETAIL';
const generic = squirrelReducer(modelName);

export const detailActions = new SquirrelActions(modelName);

export function detailReducer(state: SquirrelState<GRBook> = {data: [], error: null, loading: false, origin: null},
                              action: Action) {
  return generic(state, action);
}
