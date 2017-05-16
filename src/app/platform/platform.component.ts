import { Component, OnDestroy } from '@angular/core';
import { AppState } from '../models/store-model';
import { Store } from '@ngrx/store';
import { latestBooksActions } from '../reducers/latestBooks.reducer';
import { SquirrelState } from '@flowup/squirrel';
import { Book } from '../models/book.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.scss'],
})
export class PlatformComponent implements OnDestroy {

  /**
   * Recently added books holder
   * @type {Array}
   */
  books: Book[] = [];
  /**
   * Subscription for latest books
   */
  subscription: Subscription;
  loading = false;

  constructor(private store: Store<AppState>, private router: Router) {
    // get latest books and set interval
    this.store.dispatch({type: latestBooksActions.API_GET});
    setInterval(() => this.store.dispatch({type: latestBooksActions.API_GET}), 60000 * 2);
    this.subscription = this.store.select('latestBooks').subscribe(
      (data: SquirrelState<Book>) => {
        this.loading = data.loading;
        if (!data.loading) {
          this.books = data.data;
        }
      }
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Redirect user to the book detail section
   * @param id
   */
  redirectToDetail(id: number): void {
    this.router.navigateByUrl(`platform/detail/${id}`);
  }
}
