import { squirrelReducer, SquirrelActions, SquirrelState } from '@flowup/squirrel';
import { StoredReading, Reading } from '../shared/models/tracking.model';
import { Action } from '@ngrx/store';

const modelName = 'TRACKING';
const generic = squirrelReducer(modelName);
const trackingAdditionalActions = {
  API_START: `${modelName}_API_START`,
  API_END: `${modelName}_API_END`,
  START: `${modelName}_START`,
  END: `${modelName}_END`,
  API_GET_LAST: `${modelName}_API_GET_LAST`,
  GET_LAST: `${modelName}_GET_LAST`
};
export const trackingActions = new SquirrelActions(modelName, trackingAdditionalActions);
export function trackingReducer(state: SquirrelState<StoredReading> = {
  data: [{lastInterval: <Reading>{}, readings: []}],
  error: null,
  loading: false,
  origin: null
},
                                action: Action) {
  switch (action.type) {
    case trackingActions.GET:
      return Object.assign({}, state, {
        error: null,
        loading: false,
        data: [Object.assign({}, {
          lastInterval: state.data[0].lastInterval,
          readings: action.payload.body
        })],
        origin: action.payload.origin
      });
    case trackingAdditionalActions.GET_LAST:
      return Object.assign({}, state, {
        error: null,
        loading: false,
        data: [Object.assign({}, {
          lastInterval: action.payload.body,
          readings: state.data[0].readings
        })],
        origin: action.payload.origin
      });
    case trackingAdditionalActions.START:
      return Object.assign({}, state, {
        error: null,
        loading: false,
        data: [action.payload.readings ? action.payload.body : Object.assign({}, {
          lastInterval: action.payload.body,
          readings: state.data[0].readings
        })],
        origin: action.payload.origin
      });
    case trackingAdditionalActions.END:
      return Object.assign({}, state, {
        error: null,
        loading: false,
        data: [action.payload.readings ? action.payload.body : Object.assign({}, {
          lastInterval: action.payload.body,
          readings: state.data[0].readings
        })],
        origin: action.payload.origin
      });
    default:
      return generic(state, action);
  }
}