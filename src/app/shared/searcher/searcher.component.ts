import { Component, ElementRef, ViewChild, OnDestroy, AfterViewChecked } from '@angular/core';
import { GRSearchBook } from '../models/goodreadsBook.model';
import { AppState } from '../models/store-model';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import * as Tether from 'tether';
import { Router } from '@angular/router';
import { ComponentDispatcher, squirrel, SquirrelData } from '@flowup/squirrel';
import { searchActions } from '../../reducers/search.reducer';
import { Http } from '@angular/http';
import { environment } from '../../../environments/environment';
import { createOptions } from '../createOptions';


@Component({
  selector: 'app-searcher',
  templateUrl: './searcher.component.html',
  styleUrls: ['./searcher.component.scss']
})
export class SearcherComponent implements OnDestroy, AfterViewChecked {

  books: GRSearchBook[] = [];
  key: string = '';
  loading: boolean = false;
  userInputChange: Subject<string> = new Subject<string>();
  tether: Tether = null;

  showDropdown: boolean = false;
  dispatcher: ComponentDispatcher;
  subscriptions: any[] = [];

  @ViewChild('dropdown') dropdown: ElementRef;


  constructor(private store: Store<AppState>, private elRef: ElementRef, private router: Router, private http: Http) {
    this.dispatcher = new ComponentDispatcher(store, this);
    let {dataStream, errorStream} = squirrel(store, 'search', this);
    this.subscriptions.push(
      dataStream.subscribe(
        (data: SquirrelData<GRSearchBook>) => {
          this.books = data.data;
          this.loading = data.loading;

          if (this.books.length && this.tether) {
            this.tether.enable();
            this.showDropdown = true;
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

    document.body.addEventListener('click', (event) => {
      if (!this.elRef.nativeElement.contains(event.target)) {
        this.showDropdown = false;
      }
    });

  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.tether.destroy();
    this.dispatcher.dispatch((<any>searchActions.ADDITIONAL).DESTROY);
  }

  ngAfterViewChecked() {
    this.tether = new Tether({
      element: '.dropdown',
      target: '.search-input',
      attachment: 'top left',
      targetAttachment: 'bottom left',
      enabled: false
    });
  }

  changed(value: string) {
    this.loading = true;
    this.userInputChange.next(value);
  }

  displayDropdown() {
    if (this.books.length) {
      this.showDropdown = true;
    }
  }

  selected(book: GRSearchBook) {
    this.showDropdown = false;
    this.http.post(`${environment.apiUrl}/book`, book, createOptions()).subscribe(
      data => {
        this.router.navigate([`platform/detail/${data.json().id}`]);
      }
    );

  }


}
