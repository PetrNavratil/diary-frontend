import { Component, OnDestroy } from '@angular/core';
import { AppState } from '../../shared/models/store-model';
import { Store } from '@ngrx/store';
import { ComponentDispatcher, squirrel, SquirrelData } from '@flowup/squirrel';
import { User } from '../../shared/models/user.model';
import { userActions } from '../../reducers/user.reducer';
import { Http } from '@angular/http';
import { environment } from '../../../environments/environment';
import { createOptions } from '../../shared/createOptions';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnDestroy {

  dispatcher: ComponentDispatcher;
  user: User;
  subscriptions: any[] = [];
  loading: boolean = false;
  passwordLoading: boolean = false;
  errorMessage: string = '';

  constructor(private store: Store<AppState>, private http: Http) {
    this.dispatcher = new ComponentDispatcher(store, this);
    let {dataStream, errorStream} = squirrel(store, 'users', this);
    this.subscriptions.push(
      dataStream.subscribe(
        (data: SquirrelData<User>) => {
          this.loading = data.loading;
          if (data.data.length && !data.loading) {
            this.user = data.data[0];
            console.log('user', this.user);
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

  editPassword(form) {
    this.passwordLoading = true;
    this.http.post(`${environment.apiUrl}/password`,
      {oldPassword: form.oldPassword, newPassword: form.password},
      createOptions()).subscribe(
      data => {
        this.passwordLoading = false;
      },
      err => {
        this.errorMessage = err.json().message;
        this.passwordLoading = false;
      }
    )
  }

  editUser(event) {
    event.stopPropagation();
    this.dispatcher.dispatch(userActions.API_UPDATE, this.user);
  }


}
