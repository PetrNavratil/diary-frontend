import { squirrelReducer, SquirrelActions, SquirrelState } from '@flowup/squirrel';
import { Friend } from '../models/friend.model';
import { Action } from '@ngrx/store';
const modelName = 'FRIENDS';
const generic = squirrelReducer(modelName);
const additionalFriendsActions = {
  API_GET_SINGLE: `${modelName}_API_GET_SINGLE`
};

export const friendsActions = new SquirrelActions(modelName,additionalFriendsActions);

export function friendsReducer(state: SquirrelState<Friend> = {data: [], error: null, loading: false},
                              action: Action) {
  switch (action.type) {
    default:
      return generic(state, action);
  }
}