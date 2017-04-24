import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { MyBooksComponent } from './my-books/my-books.component';
import { ShelvesComponent } from './shelves/shelves.component';
import { ProfileComponent } from './profile/profile.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { FriendDetailComponent } from './friend-detail/friend-detail.component';

export const platformRoutes: Routes = [{
  path: '',
  children: [
    {path: '', component: DashboardComponent},
    {path: 'detail/:id', component: BookDetailComponent},
    {path: 'detail', component: BookDetailComponent},
    {path: 'books', component: MyBooksComponent},
    {path: 'shelves', component: ShelvesComponent},
    {path: 'profile', component: ProfileComponent},
    {path: 'statistics', component: StatisticsComponent},
    {path: 'friend/:id', component: FriendDetailComponent}
  ]
}];

