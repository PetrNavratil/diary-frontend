import { Component } from '@angular/core';
import { Friend } from '../../shared/models/friend.model';
import * as moment from 'moment';
import { AppState } from '../../shared/models/store-model';
import { Store } from '@ngrx/store';
import { SquirrelState } from '@flowup/squirrel';
import { Shelf } from '../../shared/models/shelf.model';
import { shelvesActions } from '../../reducers/shelves.reducer';
import { Book } from '../../shared/models/book.model';

@Component({
  selector: 'app-friend-detail',
  templateUrl: './friend-detail.component.html',
  styleUrls: ['./friend-detail.component.scss']
})
export class FriendDetailComponent {

  shelves: Shelf[] = [];
  book: Book = {
    id: 1,
    title: 'Megacool',
    author: 'Jolanda',
    imageUrl: 'https://images.gr-assets.com/books/1328836810l/11397479.jpg'
  };

  constructor(private store: Store<AppState>){
    this.store.dispatch({type: shelvesActions.API_GET});
    this.store.select('shelves').subscribe(
      (data: SquirrelState<Shelf>) => {
        if(!data.loading){
          this.shelves = data.data;
        }
      }
    )
  }

  friends: Friend[] =[
    {
      id: 1,
      avatar: 'https://scontent.xx.fbcdn.net/v/t1.0-1/c0.14.50.50/p50x50/13895226_1070492593039496_7069195752827529506_n.jpg?oh=f9e858c7dcb1faeebd679bc7541d25d6&oe=5988C374',
      username: 'pnik',
      firstName: 'Petr',
      lastName: 'Navratil',
      books: 15,
      shelves: 1,
      since: moment().format()
    }];

}
