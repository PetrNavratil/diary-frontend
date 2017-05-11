import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FriendDetailComponent } from './friend-detail.component';
import { BookModule } from '../book/book.module';
import { ShelvesModule } from '../shelves/shelves.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BookModule,
    ShelvesModule
  ],
  declarations: [
    FriendDetailComponent
  ],
  exports: [
    FriendDetailComponent
  ]
})
export class FriendProfileModule { }
