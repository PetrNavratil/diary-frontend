import { Component, OnDestroy } from '@angular/core';
import { AppState } from './shared/models/store-model';
import { Store } from '@ngrx/store';
import { ComponentDispatcher, squirrel, SquirrelData } from '@flowup/squirrel';
import { authActions } from './reducers/auth.reducer';
import { User } from './shared/models/user.model';
import { Router } from '@angular/router';
import { usersReducer, userActions } from './reducers/user.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss',

  ]
})
export class AppComponent implements OnDestroy {
  dispatcher: ComponentDispatcher;
  subscriptions: any[] = [];

  constructor(private router: Router, private store: Store <AppState>) {
    this.dispatcher = new ComponentDispatcher(store, this);
    this.dispatcher.dispatch(userActions.API_GET);

    let {dataStream, errorStream} = squirrel(store, 'users', this);
    this.subscriptions.push(
      dataStream.subscribe(
        (data: SquirrelData<User>) => {
          if (data.data.length) {
            if (this.router.url === '/' || this.router.url.indexOf('landing') >= 0) {
              this.router.navigate(['/platform']);
            } else {
              this.router.navigate([this.router.url]);
            }
          }
        }
      )
    );
    this.subscriptions.push(
      errorStream.subscribe(
        (error: Error) => {
          console.log('because of this');
          console.log('url', this.router.url);
          if (this.router.url !== '/landing/register') {
            this.router.navigate(['/landing/login']);
          }
        }
      )
    );
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
