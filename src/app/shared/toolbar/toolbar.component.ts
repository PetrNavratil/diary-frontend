import { Component, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, ElementRef } from '@angular/core';
import { AppState } from '../models/store-model';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { SquirrelState } from '@flowup/squirrel';
import { getImageUrl } from '../getImageUrl';
import { FriendRequest } from '../models/friendRequest.model';
import { animate, style, state, trigger, transition } from '@angular/animations';

const COLLAPSED = 'collapsed';
const EXPANDED = 'expanded';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
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
  friendRequests: FriendRequest[] = [
    {
      id: 1,
      userId: 1,
      avatar: 'https://scontent.xx.fbcdn.net/v/t1.0-1/c0.14.50.50/p50x50/13895226_1070492593039496_7069195752827529506_n.jpg?oh=f9e858c7dcb1faeebd679bc7541d25d6&oe=5988C374',
      username: 'pnik',
      firstName: 'Petr',
      lastName: 'Navratil'
    },
    {
      id: 1,
      userId: 1,
      avatar: 'https://scontent.xx.fbcdn.net/v/t1.0-1/c0.14.50.50/p50x50/13895226_1070492593039496_7069195752827529506_n.jpg?oh=f9e858c7dcb1faeebd679bc7541d25d6&oe=5988C374',
      username: 'pnik',
      firstName: 'Petr',
      lastName: 'Navratil'
    },
    {
      id: 1,
      userId: 1,
      avatar: 'https://scontent.xx.fbcdn.net/v/t1.0-1/c0.14.50.50/p50x50/13895226_1070492593039496_7069195752827529506_n.jpg?oh=f9e858c7dcb1faeebd679bc7541d25d6&oe=5988C374',
      username: 'pnik',
      firstName: 'Petr',
      lastName: 'Navratil'
    }
  ];
  menuItems: any[] = [
    {
      name: 'Books',
      link: 'books'
    },
    {
      name: 'Shelves',
      link: 'shelves'
    },
    {
      name: 'Statistics',
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

  logout() {
    localStorage.clear();
    location.reload();
  }

  toggle(event){
    event.stopPropagation();
    this.state = this.state === COLLAPSED ? EXPANDED : COLLAPSED;
  }
}
