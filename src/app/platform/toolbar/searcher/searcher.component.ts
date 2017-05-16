import { Component, OnDestroy } from '@angular/core';
import { GRSearchBook } from '../../../models/goodreadsBook.model';
import { AppState } from '../../../models/store-model';
import { Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { searchActions } from '../../../reducers/search.reducer';
import { Http } from '@angular/http';
import { environment } from '../../../../environments/environment';
import { createOptions } from '../../../shared/createOptions';
import { animate, style, state, trigger, transition } from '@angular/animations';
import { SquirrelState } from '@flowup/squirrel';

const COLLAPSED = 'collapsed';
const EXPANDED = 'expanded';

@Component({
  selector: 'app-searcher',
  templateUrl: 'searcher.component.html',
  styleUrls: ['searcher.component.scss'],
  animations: [
    trigger('expandable', [
      state(COLLAPSED, style({'height': '0', 'opacity': '0', 'width': '301px'})),
      state(EXPANDED, style({'height': '50vh', 'opacity': '1', 'width': '401px'})),
      transition('* => *', animate('500ms ease-out'))
    ])
  ],
})
export class SearcherComponent implements OnDestroy {

  /**
   * Array of found books
   * @type {GRSearchBook[]}
   */
  books: GRSearchBook[] = [];
  /**
   * Search pattern
   * @type {string}
   */
  key: string = '';
  /**
   * Loading of searching
   * @type {boolean}
   */
  loading: boolean = false;
  /**
   * Subject for input change
   * @type {Subject<string>}
   */
  userInputChange: Subject<string> = new Subject<string>();
  /**
   * Subscriptions from store
   * @type {Subscription[]}
   */
  subscriptions: Subscription[] = [];
  /**
   * States whether search content is visible
   * @type {string}
   */
  state: string = COLLAPSED;

  constructor(private store: Store<AppState>, private router: Router, private http: Http) {
    // subscribe to the search
    this.subscriptions.push(this.store.select('search').subscribe(
      (data: SquirrelState<GRSearchBook>) => {
        this.loading = data.loading;
        if (data.error) {
          console.error(data.error);
        }
        if (!data.loading) {
          this.state = data.data.length ? EXPANDED : COLLAPSED;
          this.books = data.data;
        }
      }
    ));

    // subscribe to the input change
    // dispatch action after .5s delay if changed
    this.subscriptions.push(this.userInputChange
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(value => {
        if (value === '') {
          this.loading = false;
          return;
        }
        this.store.dispatch({type: searchActions.API_GET, payload: value});
        return value;
      }));
  }

  /**
   * Called after input is changed
   * Passes pattern to the subject
   * @param value
   */
  changed(value: string): void {
    this.loading = true;
    this.userInputChange.next(value);
  }

  /**
   * Shows dropdown
   */
  displayDropdown(): void {
    if (this.books.length) {
      this.state = EXPANDED;
    }
  }

  /**
   * Hides dropdown
   */
  hideDropdown(): void {
    this.state = COLLAPSED;
  }

  /**
   * Sends request to add book to the database
   * Redirect to the book detail
   * @param book
   */
  selected(book: GRSearchBook): void {
    this.state = COLLAPSED;
    this.http.post(`${environment.apiUrl}/book`, book, createOptions()).subscribe(
      data => {
        this.router.navigate([`platform/detail/${data.json().id}`]);
      }
    );
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
