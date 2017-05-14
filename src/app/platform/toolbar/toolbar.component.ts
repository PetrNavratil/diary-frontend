import { Component, OnDestroy, ChangeDetectorRef, ElementRef } from '@angular/core';
import { AppState } from '../../models/store-model';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { SquirrelState } from '@flowup/squirrel';
import { getImageUrl } from '../../shared/getImageUrl';
import { FriendRequest } from '../../models/friendRequest.model';
import { animate, style, state, trigger, transition } from '@angular/animations';
import { requestActions } from '../../reducers/friend-request.reducer';

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

  subscriptions: Subscription[] = [];
  user: User;
  friendRequests: FriendRequest[] = [];
  menuItems: any[] = [
    {
      name: 'Knihy',
      link: 'books'
    },
    {
      name: 'Poličky',
      link: 'shelves'
    },
    {
      name: 'Přehled čtení',
      link: 'statistics'
    }
  ];
  state: string = COLLAPSED;

  constructor(private store: Store<AppState>, private cd: ChangeDetectorRef, private el: ElementRef) {
    this.subscriptions.push(this.store.select('users').subscribe(
      (data: SquirrelState<User>) => {
        if (!data.loading && data.data.length) {
          this.user = data.data[0];
          // this.cd.markForCheck()
        }
      }
    ));
    this.store.dispatch({type: requestActions.API_GET});
    this.subscriptions.push(this.store.select('requests').subscribe(
      (data: SquirrelState<FriendRequest>) => {
        if (!data.loading) {
          this.friendRequests = data.data.filter(request => request.requesterId !== this.user.id);
        }
      }
    ));


    document.body.addEventListener('click', (event) => {
      if (!this.el.nativeElement.contains(event.target)) {
        this.state = COLLAPSED;
      }
    });

  }

  get avatarUrl() {
    return getImageUrl(this.user.avatar);
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  logout(event) {
    event.stopPropagation();
    localStorage.clear();
    location.reload();
  }

  toggle(event){
    event.stopPropagation();
    this.state = this.state === COLLAPSED ? EXPANDED : COLLAPSED;
  }

  acceptRequest(id: number): void{
    this.store.dispatch({type: requestActions.ADDITIONAL.ACCEPT, payload: id});
  }

  declineRequest(id: number): void {
    this.store.dispatch({type: requestActions.ADDITIONAL.DECLINE, payload: id});
  }
}
