import { Component, ViewContainerRef } from '@angular/core';
import { AppState } from './models/store-model';
import { Store } from '@ngrx/store';
import { User } from './models/user.model';
import { Router } from '@angular/router';
import { userActions } from './reducers/user.reducer';
import { SquirrelState } from '@flowup/squirrel';
import { Subscription } from 'rxjs';
import { ToastsManager } from 'ng2-toastr';
import { AuthService } from './shared/auth.service';
import { LanguageService } from './shared/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss',
  ]
})
export class AppComponent {
  subscription: Subscription;

  constructor(private router: Router,
              private store: Store <AppState>,
              private toastr: ToastsManager,
              private vcr: ViewContainerRef,
              private auth: AuthService,
  private language: LanguageService) {
    this.language.init();
    this.auth.handleAuthentication();
    this.toastr.setRootViewContainerRef(vcr);
    if(auth.isValid()){
      this.store.dispatch({type: userActions.API_GET});
    } else {
      if(this.router.url.indexOf('register') === -1){
        this.router.navigateByUrl('/landing/login');
      }
    }
    this.subscription = this.store.select('users').subscribe(
      (data: SquirrelState<User>) => {
        if(data.loading){
          return;
        }
        if (data.error) {
          if (this.router.url !== '/landing/register') {
            this.router.navigate(['/landing/login']);
          }
        } else {
          if (data.data.length) {
            if (this.router.url === '/' || this.router.url.indexOf('landing') >= 0) {
              setTimeout(() => this.router.navigate(['/platform']), 200);
            } else {
              this.router.navigate([this.router.url]);
            }
            // to prevent redirect when user is already on platform
            this.subscription.unsubscribe();
          }
        }
      }
    );
  }
}
