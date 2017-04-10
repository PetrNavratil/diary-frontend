import { squirrelReducer, SquirrelActions, SquirrelState } from '@flowup/squirrel';
import { User } from '../shared/models/user.model';
import { Action } from '@ngrx/store';

const modelName = 'USER';
const generic = squirrelReducer(modelName);

export const userActions = new SquirrelActions(modelName);

export function usersReducer(state: SquirrelState<User> = {data: [], error: null, loading: false, origin: null},
                             action: Action) {
  switch (action.type) {
    default:
      return generic(state, action);
  }
}
