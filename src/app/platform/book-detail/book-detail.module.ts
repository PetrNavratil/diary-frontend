import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { BookDetailComponent } from './book-detail.component';
import { EducationComponent } from './education/education.component';
import { BookModule } from '../book/book.module';
import { CommentComponent } from './comment/comment.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BookModule
  ],
  declarations: [
    BookDetailComponent,
    EducationComponent,
    CommentComponent
  ],
  exports: [
    BookDetailComponent
  ]
})
export class BookDetailModule { }
