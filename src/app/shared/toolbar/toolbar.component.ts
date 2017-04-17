import { Component, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AppState } from '../models/store-model';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { SquirrelState } from '@flowup/squirrel';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent implements OnDestroy {

  subscription: Subscription;
  user: User;
  constructor(private store:Store<AppState>, private cd: ChangeDetectorRef) {
    this.subscription = this.store.select('users').subscribe(
      (data: SquirrelState<User>) => {
        if(!data.loading && data.data.length){
          this.user = data.data[0];
          // this.cd.markForCheck()
        }
      }
    )
  }

  get avatarUrl() {
    return `${environment.apiUrl}/${this.user.avatar}`;
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
