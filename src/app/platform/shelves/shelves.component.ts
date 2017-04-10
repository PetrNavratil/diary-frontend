import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../shared/models/store-model';
import { ComponentDispatcher, squirrel, SquirrelData } from '@flowup/squirrel';
import { shelvesActions } from '../../reducers/shelves.reducer';
import { Shelf } from '../../shared/models/shelf.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shelves',
  templateUrl: './shelves.component.html',
  styleUrls: ['./shelves.component.scss']
})
export class ShelvesComponent {

  dispatcher: ComponentDispatcher;
  shelfName = '';
  shelves = [];
  subscriptions = [];

  constructor(private store: Store<AppState>, private router: Router) {
    this.dispatcher = new ComponentDispatcher(store, this);
    this.dispatcher.dispatch(shelvesActions.API_GET);
    let {dataStream, errorStream} = squirrel(store, 'shelves', this);
    this.subscriptions.push(
      dataStream.subscribe(
        (data: SquirrelData<Shelf>) => {
          this.shelves = data.data;
        }
      ));
    this.subscriptions.push(
      errorStream.subscribe(
        (error: Error) => {
          console.error(error);
        }
      )
    );
  }

  addShelf() {
    this.dispatcher.dispatch(shelvesActions.API_CREATE, {name: this.shelfName});
  }

  deleteShelf(id: number) {
    this.dispatcher.dispatch(shelvesActions.API_DELETE, {id: id});
  }

  goToDetail(id: number) {
    console.log('id ', id);
    this.router.navigate([`platform/detail/${id}`]);
  }
}
