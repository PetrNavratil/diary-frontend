import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { Books } from './books.component';
import { BookModule } from '../book/book.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BookModule
  ],
  declarations: [
    Books
  ],
  exports: [
    Books
  ]
})
export class BooksModule { }
