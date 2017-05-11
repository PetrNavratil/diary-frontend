import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformComponent } from './platform.component';
import { SharedModule } from '../shared/shared.module';
import { BooksModule } from './books/books.module';
import { ShelvesModule } from './shelves/shelves.module';
import { BookModule } from './book/book.module';
import { BookDetailModule } from './book-detail/book-detail.module';
import { StatisticsModule } from './statistics/statistics.module';
import { ProfileModule } from './profile/profile.module';
import { FriendProfileModule } from './friend-profile/friend-profile.module';
import { ToolbarModule } from './toolbar/toolbar.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BooksModule,
    ShelvesModule,
    BookModule, // remove this
    BookDetailModule,
    StatisticsModule,
    ProfileModule,
    FriendProfileModule,
    ToolbarModule
  ],
  declarations: [
    PlatformComponent,
  ],
  exports: []
})
export class PlatformModule {
}
