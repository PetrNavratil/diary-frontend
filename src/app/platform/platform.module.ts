import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformComponent } from './platform.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { GoogleResource } from '../shared/resources/googleBooks';
import { SearchComponent } from './search/search.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { MyBooksComponent } from './my-books/my-books.component';
import { BookPreviewComponent } from './book-preview/book-preview.component';
import { EducationComponent } from './education/education.component';
import { ShelvesComponent } from './shelves/shelves.component';
import { ShelfComponent } from './shelf/shelf.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  providers: [
    GoogleResource,
  ],
  declarations: [
    PlatformComponent,
    DashboardComponent,
    SearchComponent,
    BookDetailComponent,
    MyBooksComponent,
    BookPreviewComponent,
    EducationComponent,
    ShelvesComponent,
    ShelfComponent,
    ProfileComponent,
  ],
  exports: []
})
export class PlatformModule {
}
