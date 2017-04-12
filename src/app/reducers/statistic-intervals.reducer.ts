import { StatisticInterval } from '../shared/models/statistic-interval.model';
import { SquirrelState, SquirrelActions, squirrelReducer } from '@flowup/squirrel';
import { Action } from '@ngrx/store';

const modelName = 'INTERVALS';
const generic = squirrelReducer(modelName);

export const intervalsActions = new SquirrelActions(modelName);
export function intervalsReducer(state: SquirrelState<StatisticInterval> = {data: [], error: null, loading: false, origin: null},
                                 action: Action) {
  switch (action.type) {
    default:
      return generic(state, action);
  }
}