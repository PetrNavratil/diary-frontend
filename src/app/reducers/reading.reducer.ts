import { squirrelReducer, SquirrelActions, SquirrelState } from '@flowup/squirrel';
import { Reading } from '../models/tracking.model';
import { Action } from '@ngrx/store';

const modelName = 'READINGS';
const generic = squirrelReducer(modelName);

export const readingsActions = new SquirrelActions(modelName);
export function readingReducer(state: SquirrelState<Reading> = {data: [], error: null, loading: false},
                               action: Action) {
  switch (action.type) {
    default:
      return generic(state, action);
  }
}