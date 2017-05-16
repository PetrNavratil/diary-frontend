import { Routes } from '@angular/router';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { Books } from './books/books.component';
import { ShelvesComponent } from './shelves/shelves.component';
import { ProfileComponent } from './profile/profile.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { FriendDetailComponent } from './friend-profile/friend-detail.component';

export const platformRoutes: Routes = [{
  path: '',
  children: [
    {path: '', component: Books},
    {path: 'detail/:id', component: BookDetailComponent},
    {path: 'detail', component: BookDetailComponent},
    {path: 'books', component: Books},
    {path: 'shelves', component: ShelvesComponent},
    {path: 'profile', component: ProfileComponent},
    {path: 'statistics', component: StatisticsComponent},
    {path: 'friend/:id', component: FriendDetailComponent}
  ]
}];

