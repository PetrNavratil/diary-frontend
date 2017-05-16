import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../models/store-model';
import {  } from '@flowup/squirrel';
import { shelvesActions } from '../../reducers/shelves.reducer';
import { Shelf } from '../../models/shelf.model';
import { Router } from '@angular/router';
import { SquirrelState } from '@flowup/squirrel';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shelves',
  templateUrl: './shelves.component.html',
  styleUrls: ['./shelves.component.scss']
})
export class ShelvesComponent {

  /**
   * Holds new shelf name
   * @type {string}
   */
  shelfName = '';
  /**
   * User's shelves
   * @type {Shelf[]}
   */
  shelves: Shelf[] = [];
  /**
   * Holds shelves names
   * @type {string[]}
   */
  shelfNames: string[] = [];
  /**
   * Store subscriptions
   * @type {Subscription[]}
   */
  subscriptions: Subscription[] = [];
  /**
   * States whether data are loading
   * @type {boolean}
   */
  loading = false;

  constructor(private store: Store<AppState>, private router: Router) {
    // get shelves
    this.store.dispatch({type: shelvesActions.API_GET});
    // subscribe to the shelves
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

  /**
   * Emits action after add shelf event occurs
   */
  addShelf():void {
    this.store.dispatch({type: shelvesActions.API_CREATE, payload: {name: this.shelfName}});
  }

  /**
   * Emits action after delete shelf event occurs
   * @param id
   */
  deleteShelf(id: number):void {
    this.store.dispatch({type: shelvesActions.API_DELETE, payload: {id: id}});
  }

  /**
   * Emits action after go to book detail event occurs
   * @param id
   */
  goToDetail(id: number):void {
    this.router.navigate([`platform/detail/${id}`]);
  }

  /**
   * Emits action after edit shelf event occurs
   * @param shelf
   */
  editShelf(shelf: Shelf):void{
    this.store.dispatch({type: shelvesActions.API_UPDATE, payload: shelf});
  }

  /**
   * Checks whether new name of shelf is unique
   * @returns {boolean}
   */
  get unique():boolean{
    return this.shelfNames.indexOf(this.shelfName) > -1;
  }

}
