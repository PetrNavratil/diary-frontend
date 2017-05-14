import { squirrelReducer, SquirrelActions, SquirrelState } from '@flowup/squirrel';
import { Statistic } from '../models/statistic.model';
import { Action } from '@ngrx/store';
const modelName = 'STATISTICS';
const generic = squirrelReducer(modelName);

export const statisticActions = new SquirrelActions(modelName);
export function statisticReducer(state: SquirrelState<Statistic> = {data: [], error: null, loading: false},
                               action: Action) {
  switch (action.type) {
    default:
      return generic(state, action);
  }
}