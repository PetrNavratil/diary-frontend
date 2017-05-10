import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../shared/models/store-model';
import {  } from '@flowup/squirrel';
import { shelvesActions } from '../../reducers/shelves.reducer';
import { Shelf } from '../../shared/models/shelf.model';
import { Router } from '@angular/router';
import { SquirrelState } from '@flowup/squirrel';

@Component({
  selector: 'app-shelves',
  templateUrl: './shelves.component.html',
  styleUrls: ['./shelves.component.scss']
})
export class ShelvesComponent {

  shelfName = '';
  shelves: Shelf[] = [];
  shelfNames: string[] = [];
  subscriptions = [];
  loading = false;

  constructor(private store: Store<AppState>, private router: Router) {
    this.store.dispatch({type: shelvesActions.API_GET});
    this.subscriptions.push(
      this.store.select('shelves').subscribe(
        (data: SquirrelState<Shelf>) => {
          this.loading = data.loading;
          if(!data.loading){
            this.shelves = data.data;
            this.shelfNames = this.shelves.map(shelf => shelf.name);
          }
        }
      ));
  }

  addShelf() {
    this.store.dispatch({type: shelvesActions.API_CREATE, payload: {name: this.shelfName}});
  }

  deleteShelf(id: number) {
    this.store.dispatch({type: shelvesActions.API_DELETE, payload: {id: id}});
  }

  goToDetail(id: number) {
    this.router.navigate([`platform/detail/${id}`]);
  }

  editShelf(shelf: Shelf){
    this.store.dispatch({type: shelvesActions.API_UPDATE, payload: shelf});
  }

  get unique(){
    return this.shelfNames.indexOf(this.shelfName) > -1;
  }

}
