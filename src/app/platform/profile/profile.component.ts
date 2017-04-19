import { Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AppState } from '../../shared/models/store-model';
import { Store } from '@ngrx/store';
import {} from '@flowup/squirrel';
import { User } from '../../shared/models/user.model';
import { userActions } from '../../reducers/user.reducer';
import { Http } from '@angular/http';
import { environment } from '../../../environments/environment';
import { createOptions } from '../../shared/createOptions';
import { SquirrelState } from '@flowup/squirrel';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnDestroy {
  user: User;
  subscriptions: any[] = [];
  loading: boolean = false;
  passwordLoading: boolean = false;
  errorMessage: string = '';
  @ViewChild('photoInput') inputElement: ElementRef;

  constructor(private store: Store<AppState>, private http: Http) {

    this.subscriptions.push(
      this.store.select('users').subscribe(
        (data: SquirrelState<User>) => {
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
    this.store.dispatch({type: userActions.API_UPDATE, payload: this.user});
  }

  openFile() {
    this.inputElement.nativeElement.click();
  }

  uploadFile() {
    console.info(this.inputElement.nativeElement.files);
    if (this.inputElement.nativeElement.files.length > 0) {
      this.store.dispatch({type: userActions.ADDITIONAL.UPLOAD_AVATAR, payload: this.inputElement.nativeElement.files[0]});
    }
  }

  get avatarUrl() {
    return `${environment.apiUrl}/${this.user.avatar}`;
  }


}
