import { Component } from '@angular/core';
import { AppState } from '../../../models/store-model';
import { Store } from '@ngrx/store';
import { StoredReading, Reading } from '../../../models/tracking.model';
import { trackingActions } from '../../../reducers/tracking.reducer';
import * as moment from 'moment'
import { User } from '../../../models/user.model';
import { Router } from '@angular/router';
import { SquirrelState } from '@flowup/squirrel';
import { simpleDuration } from '../../../shared/duration-format';

@Component({
  selector: 'app-tracking-bar',
  templateUrl: 'tracking-bar.component.html',
  styleUrls: ['tracking-bar.component.scss'],
})
export class TrackingBarComponent {
  subscriptions: any[] = [];
  reading: Reading;
  time: string = '';
  getLast: boolean = true;

  constructor(private store: Store<AppState>, private router: Router ) {
    this.subscriptions.push(
      this.store.select('users').subscribe(
        (data: SquirrelState<User>) => {
          if (this.getLast && data.data.length && !data.loading) {
            this.getLast = false;
            this.store.dispatch({type:trackingActions.ADDITIONAL.API_GET_LAST});
          }
        }
      ));

    this.subscriptions.push(
      this.store.select('tracking').subscribe(
        (data: SquirrelState<StoredReading>) => {
          if(data.error){
            console.error(data.error);
          } else {
            if (!data.loading) {
              this.reading = data.data[0].lastInterval;
              this.time = '';
            }
          }
        }
      ));

    setInterval(() => {
      if (this.reading && !this.reading.completed) {
        let now = moment();
        this.time = simpleDuration(moment.duration(now.diff(moment(this.reading.start))));
      }
    }, 1000);
  }

  start() {
    this.store.dispatch({type:trackingActions.ADDITIONAL.API_START, payload:{id: this.reading.bookId, readings: true}});
  }

  stop() {
    this.store.dispatch({type:trackingActions.ADDITIONAL.API_END, payload:{id: this.reading.bookId, readings: true}});
  }

  redirectToDetail(){
    this.router.navigate([`platform/detail/${this.reading.bookId}`]);
  }
}
