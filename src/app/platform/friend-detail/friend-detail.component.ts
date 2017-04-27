import { Component } from '@angular/core';
import { Friend } from '../../shared/models/friend.model';
import { AppState } from '../../shared/models/store-model';
import { Store } from '@ngrx/store';
import { SquirrelState } from '@flowup/squirrel';
import { shelvesActions } from '../../reducers/shelves.reducer';
import { ActivatedRoute, Router } from '@angular/router';
import { friendsActions } from '../../reducers/friends.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-friend-detail',
  templateUrl: './friend-detail.component.html',
  styleUrls: ['./friend-detail.component.scss']
})
export class FriendDetailComponent {

  friend: Friend;
  subscriptions: Subscription[] = [];

  constructor(private store: Store<AppState>, private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.store.dispatch({type: friendsActions.ADDITIONAL.API_GET_SINGLE, payload: id})
      }
    });

    this.subscriptions.push(
      this.store.select('friends').subscribe(
        (data: SquirrelState<Friend>) => {
          if(!data.loading){
            // wait for new data... there are from profile
            if(data.data.length === 1) {
              this.friend = data.data[0];
            }
          }
        }
      )
    )
  }

  removeFriend(id: number){
    this.store.dispatch({type: friendsActions.API_DELETE, payload: id});
    this.router.navigateByUrl('platform/profile');
  }

  copyShelf(id: number){
    console.log('id', id);
    this.store.dispatch({type: shelvesActions.ADDITIONAL.API_COPY, payload: id});
  }


}
