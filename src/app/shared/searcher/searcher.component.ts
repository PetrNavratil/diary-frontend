import { Component, OnDestroy } from '@angular/core';
import { GRSearchBook } from '../models/goodreadsBook.model';
import { AppState } from '../models/store-model';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ComponentDispatcher, squirrel, SquirrelData } from '@flowup/squirrel';
import { searchActions } from '../../reducers/search.reducer';
import { Http } from '@angular/http';
import { environment } from '../../../environments/environment';
import { createOptions } from '../createOptions';
import { animate, style, state, trigger, transition } from '@angular/animations';

const COLLAPSED = 'collapsed';
const EXPANDED = 'expanded';

@Component({
  selector: 'app-searcher',
  templateUrl: './searcher.component.html',
  styleUrls: ['./searcher.component.scss'],
  animations: [
    trigger('expandable', [
      state(COLLAPSED, style({'height': '0', 'opacity': '0', 'width': '301px'})),
      state(EXPANDED, style({'height': '50vh', 'opacity': '1', 'width' :'601px'})),
      transition('* => *', animate('500ms ease-out'))
    ])
  ],
})
export class SearcherComponent implements OnDestroy {

  books: GRSearchBook[] = [];
  key: string = '';
  loading: boolean = false;
  userInputChange: Subject<string> = new Subject<string>();
  dispatcher: ComponentDispatcher;
  subscriptions: any[] = [];
  state: string = COLLAPSED;


  constructor(private store: Store<AppState>,  private router: Router, private http: Http) {
    this.dispatcher = new ComponentDispatcher(store, this);
    let {dataStream, errorStream} = squirrel(store, 'search', this);
    this.subscriptions.push(
      dataStream.subscribe(
        (data: SquirrelData<GRSearchBook>) => {
          this.loading = data.loading;
          if (!data.loading) {
            this.state = data.data.length ? EXPANDED : COLLAPSED;
            this.books = data.data;
          }
        }
      )
    );
    this.subscriptions.push(
      errorStream.subscribe(
        (error: Error) => {
          console.error(error);
          this.loading = false;
        }
      )
    );

    this.userInputChange
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(value => {
        if (value === '') {
          this.loading = false;
          return;
        }
        this.dispatcher.dispatch(searchActions.API_GET, value);
        return value;
      });
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  changed(value: string) {
    this.loading = true;
    this.userInputChange.next(value);
  }

  displayDropdown() {
    if (this.books.length) {
      this.state = EXPANDED;
    }
  }

  hideDropdown(){
    this.state = COLLAPSED;
  }

  selected(book: GRSearchBook) {
    this.state = COLLAPSED;
    this.http.post(`${environment.apiUrl}/book`, book, createOptions()).subscribe(
      data => {
        this.router.navigate([`platform/detail/${data.json().id}`]);
      }
    );

  }


}
