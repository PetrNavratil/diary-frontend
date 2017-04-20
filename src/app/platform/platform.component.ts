import { Component, OnDestroy } from '@angular/core';
import { AppState } from '../shared/models/store-model';
import { Store } from '@ngrx/store';
import { latestBooksActions } from '../reducers/latestBooks.reducer';
import { SquirrelState } from '@flowup/squirrel';
import { Book } from '../shared/models/book.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.scss'],
})
export class PlatformComponent implements OnDestroy{

  books: Book[] = [];
  subscription: Subscription;

  constructor(private store: Store<AppState>, private router: Router) {
    this.store.dispatch({type: latestBooksActions.API_GET});
    setInterval(() => this.store.dispatch({type: latestBooksActions.API_GET}), 60000*2);
    this.subscription = this.store.select('latestBooks').subscribe(
      (data: SquirrelState<Book>) => {
        if(!data.loading) {
          this.books = data.data;
        }
      }
    )
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  redirectToDetail(id: number){
    this.router.navigateByUrl(`platform/detail/${id}`);
  }
}
