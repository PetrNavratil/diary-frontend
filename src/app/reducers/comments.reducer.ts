import { squirrelReducer, SquirrelActions, SquirrelState } from '@flowup/squirrel';
import { Action } from '@ngrx/store';

const modelName = 'COMMENTS';
const generic = squirrelReducer(modelName);

export const commentActions = new SquirrelActions(modelName);

export function commentReducer(state: SquirrelState<Comment> = {data: [], error: null, loading: false, origin: null},
                               action: Action) {
  switch (action.type) {
    default:
      return generic(state, action);
  }
}