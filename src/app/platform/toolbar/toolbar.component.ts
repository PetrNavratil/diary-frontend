import { Component, OnDestroy, ElementRef } from '@angular/core';
import { AppState } from '../../models/store-model';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { SquirrelState } from '@flowup/squirrel';
import { getImageUrl } from '../../shared/getImageUrl';
import { FriendRequest } from '../../models/friendRequest.model';
import { animate, style, state, trigger, transition } from '@angular/animations';
import { requestActions } from '../../reducers/friend-request.reducer';
import { AuthService } from '../../shared/auth.service';

const COLLAPSED = 'collapsed';
const EXPANDED = 'expanded';

@Component({
  selector: 'app-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.scss'],
  animations: [
    trigger('expandable', [
      state(COLLAPSED, style({'height': '0', 'opacity': '0',})),
      state(EXPANDED, style({'height': '*', 'opacity': '1',})),
      transition('* => *', animate('500ms ease-out'))
    ])
  ],
})
export class ToolbarComponent implements OnDestroy {

  /**
   * Store subscriptions
   * @type {Subscription[]}
   */
  subscriptions: Subscription[] = [];
  /**
   * User's data
   * @type {User}
   */
  user: User;
  /**
   * User's incoming friend requests
   * @type {FriendRequest[]}
   */
  friendRequests: FriendRequest[] = [];
  /**
   * Items of menu
   * @type {{name: string; link: string}[]}
   */
  menuItems: any[] = [
    {
      name: 'books.title',
      link: 'books'
    },
    {
      name: 'shelves.title',
      link: 'shelves'
    },
    {
      name: 'statistics.title',
      link: 'statistics'
    }
  ];
  /**
   * States whether friendrequest is expanded
   * @type {string}
   */
  state: string = COLLAPSED;

  constructor(private store: Store<AppState>,
              private el: ElementRef,
              private auth: AuthService) {
    // subscribe to the store
    this.subscriptions.push(this.store.select('users').subscribe(
      (data: SquirrelState<User>) => {
        if (!data.loading && data.data.length) {
          this.user = data.data[0];
        }
      }
    ));
    // get user's friend requests
    this.store.dispatch({type: requestActions.API_GET});
    // subscribe to the requests
    this.subscriptions.push(this.store.select('requests').subscribe(
      (data: SquirrelState<FriendRequest>) => {
        if (!data.loading) {
          // save only incoming requests
          this.friendRequests = data.data.filter(request => request.requesterId !== this.user.id);
        }
      }
    ));

    // register listener to close dropdown after click outside of it
    document.body.addEventListener('click', (event) => {
      if (!this.el.nativeElement.contains(event.target)) {
        this.state = COLLAPSED;
      }
    });

  }

  /**
   * Gets avatar's url
   * @returns {string}
   */
  get avatarUrl(): string {
    return getImageUrl(this.user.avatar);
  }

  /**
   * Logouts user
   * @param event
   */
  logout(event): void {
    event.stopPropagation();
    this.auth.logout();
  }

  /**
   * Shows/Hides friendrequest component
   * @param event
   */
  toggle(event): void {
    event.stopPropagation();
    this.state = this.state === COLLAPSED ? EXPANDED : COLLAPSED;
  }

  /**
   * Dispatches action after accept request button has been clicked
   * @param id
   */
  acceptRequest(id: number): void {
    this.store.dispatch({type: requestActions.ADDITIONAL.ACCEPT, payload: id});
  }

  /**
   * Dispatches action after decline request button has been clicked
   * @param id
   */
  declineRequest(id: number): void {
    this.store.dispatch({type: requestActions.ADDITIONAL.DECLINE, payload: id});
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
