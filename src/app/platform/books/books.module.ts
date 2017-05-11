import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { MyBooksComponent } from './my-books.component';
import { BookModule } from '../book/book.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BookModule
  ],
  declarations: [
    MyBooksComponent
  ],
  exports: [
    MyBooksComponent
  ]
})
export class BooksModule { }
