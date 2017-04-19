import { Action } from '@ngrx/store';
import { squirrelReducer, SquirrelActions, SquirrelState } from '@flowup/squirrel';
import { BookInfo } from '../shared/models/book.model';


const modelName = 'DETAIL';
const generic = squirrelReducer(modelName);

export const detailActions = new SquirrelActions(modelName);

export function detailReducer(state: SquirrelState<BookInfo> = {data: [], error: null, loading: false},
                              action: Action) {
  switch(action.type){
    default:
      return generic(state, action);
  }

}
