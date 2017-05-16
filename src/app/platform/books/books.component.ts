import { Component, OnDestroy } from '@angular/core';
import { SquirrelState } from '@flowup/squirrel';
import { AppState } from '../../models/store-model';
import { Store } from '@ngrx/store';
import { Book } from '../../models/book.model';
import { booksActions } from '../../reducers/books.reducer';
import { Router } from '@angular/router';
import { BookStatus } from '../../models/book-status.enum';
import { PdfService } from '../../shared/pdf.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-books',
  templateUrl: 'books.component.html',
  styleUrls: ['books.component.scss']
})
export class Books implements OnDestroy {

  /**
   * Subscription to store
   * @type {Subscription[]}
   */
  subscriptions: Subscription[] = [];
  /**
   * User's books
   * @type {Book[]}
   */
  books: Book[] = [];
  /**
   * Currently visible books
   * @type {Book[]}
   */
  selectedBooks: Book[] = [];
  /**
   * Selected status of filter
   * @type {BookStatus}
   */
  selected: BookStatus = BookStatus.ALL;
  /**
   * Search pattern
   * @type {string}
   */
  pattern: string = '';

  constructor(private store: Store<AppState>, private router: Router, private pdf: PdfService) {
    // get data and subscribe to books
    this.store.dispatch({type: booksActions.API_GET});
    this.subscriptions.push(
      this.store.select('books').subscribe(
        (data: SquirrelState<Book>) => {
          this.books = data.data;
          this.selectedBooks = data.data;
        }
      )
    );
  }

  /**
   * Redirect to the book detail after click
   * @param id
   */
  goToDetail(id: number): void {
    this.router.navigate([`platform/detail/${id}`]);
  }

  /**
   * Filters books by provided status
   * @param status
   * @returns {Book[]}
   */
  selectBooks(status: BookStatus): Book[] {
    if (status === BookStatus.ALL) {
      return this.books;
    } else {
      return this.books.filter(book => book.status === status);
    }
  }

  /**
   * Filters selected books after status option is clicked in stastus dropdown
   * @param status
   */
  selectNewBooks(status: BookStatus): void {
    this.selected = status;
    this.selectedBooks = this.selectBooks(this.selected);
  }

  /**
   * Search among selected books by pattern
   * Stores them to selectedBooks
   */
  search(): void {
    this.selectedBooks = this.selectBooks(this.selected).filter(book => {
      return book.title.toLowerCase().indexOf(this.pattern.toLowerCase()) > -1 || book.author.toLowerCase().indexOf(this.pattern.toLowerCase()) > -1;
    })
  }

  /**
   * Clears search pattern after button is clicked
   * @param event
   */
  clearPattern(event): void {
    event.stopPropagation();
    this.pattern = '';
    this.selectedBooks = this.selectBooks(this.selected);
  }

  /**
   * Generates PDF list of books after button is clicked
   */
  generatePdf(): void {
    this.pdf.generateBooksPdf(this.selected);
  }

  /**
   * Generates TXT list of books after button is clicked
   */
  generateTxt(): void {
    this.pdf.generateBooksTxt(this.selected);
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    // clear store
    this.store.dispatch({type: 'CLEAR'});
  }
}
