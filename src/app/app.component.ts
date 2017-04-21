import { Component, OnDestroy, ViewContainerRef } from '@angular/core';
import { AppState } from './shared/models/store-model';
import { Store } from '@ngrx/store';
import { User } from './shared/models/user.model';
import { Router } from '@angular/router';
import { userActions } from './reducers/user.reducer';
import { SquirrelState } from '@flowup/squirrel';
import { Subscription } from 'rxjs';
import { ToastsManager } from 'ng2-toastr';
import { AuthService } from './shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss',
  ]
})
export class AppComponent implements OnDestroy {
  subscription: Subscription;

  constructor(private router: Router, private store: Store <AppState>, private toastr: ToastsManager, private vcr: ViewContainerRef, private auth: AuthService) {
    this.auth.handleAuthentication();
    this.toastr.setRootViewContainerRef(vcr);
    this.store.dispatch({type: userActions.API_GET});
    this.subscription = this.store.select('users').subscribe(
      (data: SquirrelState<User>) => {
        if (data.error) {
          console.log('because of this');
          console.log('url', this.router.url);
          if (this.router.url !== '/landing/register') {
            this.router.navigate(['/landing/login']);
          }
        }
        if (data.data.length) {
          if (this.router.url === '/' || this.router.url.indexOf('landing') >= 0) {
            this.router.navigate(['/platform']);
          } else {
            this.router.navigate([this.router.url]);
          }
        }
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
