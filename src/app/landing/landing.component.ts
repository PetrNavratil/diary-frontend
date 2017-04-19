import { Component, OnDestroy } from '@angular/core';
import { AppState } from '../shared/models/store-model';
import { Store } from '@ngrx/store';
import { authActions } from '../reducers/auth.reducer';
import { User } from '../shared/models/user.model';
import { ActivatedRoute, Params } from '@angular/router';
import { SquirrelState } from '@flowup/squirrel';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnDestroy {

  subscription: Subscription;
  errorMessage: string = '';
  show: string = 'login';

  constructor(private store: Store<AppState>, private route: ActivatedRoute) {
    this.route.params.subscribe(
      (params: Params) => {
        if (params['action']) {
          this.show = params['action'];
        }
      }
    );
    this.subscription = this.store.select('auth').subscribe(
      (data: SquirrelState<User>) => {
        if (data.error) {
          this.errorMessage = data.error.message;
          console.error(data.error.message);
        } else {
          this.errorMessage = '';
        }
      }
    );
  }

  register(form) {
    console.log('register form', form.value);
    this.store.dispatch({type: authActions.ADDITIONAL.REGISTER, payload: form.value});
  }

  login(form) {
    console.log('login form', form.value);
    this.store.dispatch({type: authActions.ADDITIONAL.LOGIN, payload: form.value});
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}


interface Register {
  userName: string,
  email: string,
  password: string,
  confirmPassword: string
}
