import { squirrelReducer, SquirrelActions, SquirrelState } from '@flowup/squirrel';
import { User } from '../shared/models/user.model';
import { Action } from '@ngrx/store';

const modelName = 'USER';
const generic = squirrelReducer(modelName);

const userAdditionalActions = {
  UPLOAD_AVATAR: `${modelName}_UPLOAD_AVATAR`
};

export const userActions = new SquirrelActions(modelName, userAdditionalActions);

export function usersReducer(state: SquirrelState<User> = {data: [], error: null, loading: false},
                             action: Action) {
  switch (action.type) {
    case 'CLEAR':
      return state;
    default:
      return generic(state, action);
  }
}
