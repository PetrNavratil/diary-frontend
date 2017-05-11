import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ShelvesComponent } from './shelves.component';
import { BookModule } from '../book/book.module';
import { ShelfComponent } from './shelf/shelf.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BookModule
  ],
  declarations: [
    ShelvesComponent,
    ShelfComponent
  ],
  exports: [
    ShelvesComponent,
    ShelfComponent
  ]
})
export class ShelvesModule { }
