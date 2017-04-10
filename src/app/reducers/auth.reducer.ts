import { squirrelReducer, SquirrelActions, SquirrelState } from '@flowup/squirrel';
import { Action } from '@ngrx/store';
import { User } from '../shared/models/user.model';

const modelName = 'AUTH';
const generic = squirrelReducer(modelName);
const additionalAuthActions = {
  LOGIN: `${modelName}_API_LOGIN`,
  REGISTER: `${modelName}_API_REGISTER`,
  AUTH: `${modelName}_API_TRY`
};

export const authActions = new SquirrelActions(modelName, additionalAuthActions);

export function authReducer(state: SquirrelState<User> = {data: [], error: null, loading: false, origin: null},
                            action: Action) {
  switch (action.type) {
    case additionalAuthActions.LOGIN:
      return Object.assign({}, state, {loading: true});
    case additionalAuthActions.REGISTER:
      return Object.assign({}, state, {loading: true});
  }
  return generic(state, action);
}
