import { Component, OnDestroy } from '@angular/core';
import { SquirrelState } from '@flowup/squirrel';
import { AppState } from '../../shared/models/store-model';
import { Store } from '@ngrx/store';
import { Book } from '../../shared/models/book.model';
import { booksActions } from '../../reducers/books.reducer';
import { Router } from '@angular/router';
import { BookStatus } from '../../shared/models/book-status.enum';
import { PdfService } from '../../shared/pdf.service';

@Component({
  selector: 'app-my-books',
  templateUrl: './my-books.component.html',
  styleUrls: ['./my-books.component.scss']
})
export class MyBooksComponent implements OnDestroy {

  subscriptions: any[] = [];
  books: Book[] = [];
  selectedBooks: Book[] = [];
  selected: BookStatus = BookStatus.ALL;
  pattern: string = '';

  constructor(private store: Store<AppState>, private router: Router, private pdf: PdfService) {
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
    this.store.dispatch({type: 'CLEAR'});
  }

  generatePdf(){
    this.pdf.generateBooksPdf(this.selected);
  }

  get pdfLoading() {
    return this.pdf.loading$;
  }

}
