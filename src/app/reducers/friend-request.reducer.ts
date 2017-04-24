import { squirrelReducer, SquirrelActions, SquirrelState } from '@flowup/squirrel';
import { FriendRequest } from '../shared/models/friendRequest.model';
import { Action } from '@ngrx/store';
const modelName = 'REQUEST';
const generic = squirrelReducer(modelName);

const additionalRequestActions = {
  ACCEPT: `${modelName}_ACCEPT`,
  DECLINE: `${modelName}_DECLINE`
};

export const requestActions = new SquirrelActions(modelName,additionalRequestActions);

export function requestReducer(state: SquirrelState<FriendRequest> = {data: [], error: null, loading: false},
                               action: Action) {
  switch (action.type) {
    case 'CLEAR':
      return state;
    default:
      return generic(state, action);
  }
}
