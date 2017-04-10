import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SearchComponent } from './search/search.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { MyBooksComponent } from './my-books/my-books.component';
import { ShelvesComponent } from './shelves/shelves.component';
import { ProfileComponent } from './profile/profile.component';

export const platformRoutes: Routes = [{
  path: '',
  children: [
    {path: '', component: DashboardComponent},
    {path: 'search', component: SearchComponent},
    {path: 'detail/:id', component: BookDetailComponent},
    {path: 'detail', component: BookDetailComponent},
    {path: 'books', component: MyBooksComponent},
    {path: 'shelves', component: ShelvesComponent},
    {path: 'profile', component: ProfileComponent}
  ]
}];

