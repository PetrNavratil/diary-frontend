import { Component, OnDestroy } from '@angular/core';
import { ComponentDispatcher, squirrel, SquirrelData } from '@flowup/squirrel';
import { AppState } from '../../shared/models/store-model';
import { Store } from '@ngrx/store';
import { Book } from '../../shared/models/book.model';
import { booksActions } from '../../reducers/books.reducer';
import { Router } from '@angular/router';
import { BookStatus } from '../../shared/models/book-status.enum';

@Component({
  selector: 'app-my-books',
  templateUrl: './my-books.component.html',
  styleUrls: ['./my-books.component.scss']
})
export class MyBooksComponent implements OnDestroy {

  dispatcher: ComponentDispatcher;
  subscriptions: any[] = [];
  books: Book[] = [];
  selectedBooks: Book[] = [];
  selected: BookStatus = BookStatus.ALL;
  pattern: string = '';

  constructor(private store: Store<AppState>, private router: Router) {
    this.dispatcher = new ComponentDispatcher(store, this);
    this.dispatcher.dispatch(booksActions.API_GET);
    let {dataStream, errorStream} = squirrel(store, 'books', this);
    this.subscriptions.push(
      dataStream.subscribe(
        (data: SquirrelData<Book>) => {
          this.books = data.data;
          this.selectedBooks = data.data;
        }
      )
    );
  }

  goToDetail(id: number): void {
    this.router.navigate([`platform/detail/${id}`]);
  }

  selectBooks(status: BookStatus): Book[] {
    if (status === BookStatus.ALL) {
      return this.books;
    } else {
      return this.books.filter(book => book.status === status);
    }
  }

  selectNewBooks(status: BookStatus) {
    this.selected = status;
    this.selectedBooks = this.selectBooks(this.selected);
  }

  search() {
    this.selectedBooks = this.selectBooks(this.selected).filter(book => {
      return book.title.toLowerCase().indexOf(this.pattern.toLowerCase()) > -1 || book.author.toLowerCase().indexOf(this.pattern.toLowerCase()) > -1;
    })
  }

  clearPattern(event) {
    event.stopPropagation();
    this.pattern = '';
    this.selectedBooks = this.selectBooks(this.selected);
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
