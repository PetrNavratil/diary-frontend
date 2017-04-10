import { Component } from '@angular/core';
import { ComponentDispatcher, squirrel, SquirrelData } from '@flowup/squirrel';
import { AppState } from '../shared/models/store-model';
import { Store } from '@ngrx/store';
import { authActions } from '../reducers/auth.reducer';
import { User } from '../shared/models/user.model';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

  dispatcher: ComponentDispatcher;
  subscriptions: any[] = [];
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

    this.dispatcher = new ComponentDispatcher(store, this);
    let {dataStream, errorStream} = squirrel(store, 'auth', this);
    this.subscriptions.push(
      dataStream.subscribe(
        (data: SquirrelData<User>) => {
          this.errorMessage = '';
        }
      )
    );
    this.subscriptions.push(
      errorStream.subscribe(
        (error: Error) => {
          this.errorMessage = error.message;
          console.error(error.message);
        }
      )
    );
  }

  register(form) {
    console.log('register form', form.value);
    this.dispatcher.dispatch((<any>authActions.ADDITIONAL).REGISTER, form.value);
  }

  login(form) {
    console.log('login form', form.value);
    this.dispatcher.dispatch((<any>authActions.ADDITIONAL).LOGIN, form.value);
  }
}


interface Register {
  userName: string,
  email: string,
  password: string,
  confirmPassword: string
}
