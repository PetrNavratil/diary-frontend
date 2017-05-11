import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { BookPreviewComponent } from './book-preview.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    BookPreviewComponent
  ],
  exports: [
    BookPreviewComponent
  ]
})
export class BookModule { }
