import { squirrelReducer, SquirrelActions, SquirrelState } from '@flowup/squirrel';
import { Shelf } from '../shared/models/shelf.model';
import { Action } from '@ngrx/store';

const modelName = 'SHELVES';
const generic = squirrelReducer(modelName);
const shelvesAdditionalActions = {
  API_ADD_BOOK: `${modelName}_API_ADD_BOOK`,
  API_REMOVE_BOOK: `${modelName}_API_REMOVE_BOOK`,
  ADD_BOOK: `${modelName}_ADD_BOOK`,
  REMOVE_BOOK: `${modelName}_REMOVE_BOOK`
};

export const shelvesActions = new SquirrelActions(modelName, shelvesAdditionalActions);

export function shelvesReducer(state: SquirrelState<Shelf> = {data: [], error: null, loading: false, origin: null},
                               action: Action) {
  switch (action.type) {
    case shelvesAdditionalActions.API_ADD_BOOK:
      return Object.assign({}, state, {loading: true});
    case shelvesAdditionalActions.API_REMOVE_BOOK:
      return Object.assign({}, state, {loading: true});
    // case shelvesAdditionalActions.ADD_BOOK:
    //   return Object.assign({},state,{
    //     error: null,
    //     loading: false,
    //     origin: action.payload.origin,
    //     data: state.data.map(shelf => addBook(shelf, action))
    //   });
    //
    // case shelvesAdditionalActions.REMOVE_BOOK:
    //   return Object.assign({},state,{
    //     error: null,
    //     loading: false,
    //     origin: action.payload.origin,
    //     data: state.data.map(shelf => removeBook(shelf, action))
    //   });
    default:
      return generic(state, action);
  }
}


// function addBook(shelf, action){
//   if(shelf.id === action.payload.body.id){
//     return Object.assign({}, shelf, {books: [...shelf.books, action.payload.body.book]});
//   } else{
//     return shelf;
//   }
// }
//
// function removeBook(shelf, action){
//   if(shelf.id === action.payload.body.id){
//       return Object.assign({}, shelf, {books: shelf.books.filter(book => book.id != action.payload.body.shelf.id)});
//   } else {
//     return shelf;
//   }
// }
