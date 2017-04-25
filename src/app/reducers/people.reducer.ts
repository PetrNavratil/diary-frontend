import { Action } from '@ngrx/store';
import { SquirrelActions, squirrelReducer, SquirrelState } from '@flowup/squirrel';
import { User } from '../shared/models/user.model';

const modelName = 'PEOPLE';
const generic = squirrelReducer(modelName);

export const peopleActions = new SquirrelActions(modelName);

export function peopleReducer(state: SquirrelState<User> = {data: [], error: null, loading: false},
                               action: Action) {
  switch (action.type) {
    default:
      return generic(state, action);
  }
}