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
import { ToastrService } from '../../shared/toastr.service';
import { getImageUrl } from '../../shared/getImageUrl';
import { FriendRequest } from '../../shared/models/friendRequest.model';
import { Friend } from '../../shared/models/friend.model';
import * as moment from 'moment';

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

  friends: Friend[] = [
    {
      id: 1,
      avatar: 'https://scontent.xx.fbcdn.net/v/t1.0-1/c0.14.50.50/p50x50/13895226_1070492593039496_7069195752827529506_n.jpg?oh=f9e858c7dcb1faeebd679bc7541d25d6&oe=5988C374',
      username: 'pnik',
      firstName: 'Petr',
      lastName: 'Navratil',
      books: 15,
      shelves: 1,
      since: moment().format()
    },
    {
      id: 1,
      avatar: 'https://scontent.xx.fbcdn.net/v/t1.0-1/c0.14.50.50/p50x50/13895226_1070492593039496_7069195752827529506_n.jpg?oh=f9e858c7dcb1faeebd679bc7541d25d6&oe=5988C374',
      username: 'pnik',
      firstName: 'Petr',
      lastName: 'Navratil',
      books: 15,
      shelves: 1,
      since: moment().format()
    },
    {
      id: 1,
      avatar: 'https://scontent.xx.fbcdn.net/v/t1.0-1/c0.14.50.50/p50x50/13895226_1070492593039496_7069195752827529506_n.jpg?oh=f9e858c7dcb1faeebd679bc7541d25d6&oe=5988C374',
      username: 'pnik',
      firstName: 'Petr',
      lastName: 'Navratil',
      books: 15,
      shelves: 1,
      since: moment().format()
    },
  ];

  constructor(private store: Store<AppState>, private http: Http, private toastr: ToastrService) {

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
      () => {
        this.passwordLoading = false;
        this.toastr.showSuccess('Heslo bylo úspěšně změněno.', 'Uživatel');
      },
      err => {
        this.errorMessage = err.json().message;
        this.passwordLoading = false;
        this.toastr.showError('Heslo se nepodařilo změnit.', 'Uživatel');
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
    console.log()
    return getImageUrl(this.user.avatar);
  }


}
