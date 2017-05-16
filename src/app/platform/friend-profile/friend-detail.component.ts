import { Component } from '@angular/core';
import { Friend } from '../../models/friend.model';
import { AppState } from '../../models/store-model';
import { Store } from '@ngrx/store';
import { SquirrelState } from '@flowup/squirrel';
import { shelvesActions } from '../../reducers/shelves.reducer';
import { ActivatedRoute, Router } from '@angular/router';
import { friendsActions } from '../../reducers/friends.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-friend-detail',
  templateUrl: 'friend-detail.component.html',
  styleUrls: ['friend-detail.component.scss']
})
export class FriendDetailComponent {

  /**
   * Friend's data
   * @type{Friend}
   */
  friend: Friend;
  /**
   * Store subscriptions
   * @type {Subscription[]}
   */
  subscriptions: Subscription[] = [];

  constructor(private store: Store<AppState>, private route: ActivatedRoute, private router: Router) {
    // get id of friend
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        // get friend info
        this.store.dispatch({type: friendsActions.ADDITIONAL.API_GET_SINGLE, payload: id})
      }
    });

    // subscribe to store
    this.subscriptions.push(
      this.store.select('friends').subscribe(
        (data: SquirrelState<Friend>) => {
          if (!data.loading) {
            // wait for new data... there are from profile
            if (data.data.length === 1) {
              this.friend = data.data[0];
            }
          }
        }
      )
    )
  }

  /**
   * Dispatches action to remove friend specified by id
   * Redirect to profile after that
   * @param id
   */
  removeFriend(id: number): void {
    this.store.dispatch({type: friendsActions.API_DELETE, payload: id});
    this.router.navigateByUrl('platform/profile');
  }

  /**
   * Dispatches action to copy friend's shelf to user's
   * @param id
   */
  copyShelf(id: number): void {
    this.store.dispatch({type: shelvesActions.ADDITIONAL.API_COPY, payload: id});
  }

  /**
   * Redirect to go to the book detail after click on button
   * @param id
   */
  goToDetail(id: number): void {
    this.router.navigateByUrl(`platform/detail/${id}`);
  }

}
