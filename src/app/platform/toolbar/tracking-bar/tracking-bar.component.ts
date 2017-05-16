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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tracking-bar',
  templateUrl: 'tracking-bar.component.html',
  styleUrls: ['tracking-bar.component.scss'],
})
export class TrackingBarComponent {
  /**
   * Subscriptions to the store
   * @type {Subscription[]}
   */
  subscriptions: Subscription[] = [];
  /**
   * Last reading
   * @type {Reading}
   */
  reading: Reading;
  /**
   * Displayed time
   * @type {string}
   */
  time: string = '';
  /**
   * States whether last should be got
   * @type {boolean}
   */
  getLast: boolean = true;

  constructor(private store: Store<AppState>, private router: Router) {
    // subscribe to the users
    this.subscriptions.push(
      this.store.select('users').subscribe(
        (data: SquirrelState<User>) => {
          // get last is to prevent getting reading after user store slice is changed
          if (this.getLast && data.data.length && !data.loading) {
            this.getLast = false;
            // get last tracking
            this.store.dispatch({type: trackingActions.ADDITIONAL.API_GET_LAST});
          }
        }
      ));

    // subscribe to the tracking
    this.subscriptions.push(
      this.store.select('tracking').subscribe(
        (data: SquirrelState<StoredReading>) => {
          if (data.error) {
            console.error(data.error);
          } else {
            if (!data.loading) {
              this.reading = data.data[0].lastInterval;
              this.time = '';
            }
          }
        }
      ));

    // set interval to execute update of time after 1s
    setInterval(() => {
      if (this.reading && !this.reading.completed) {
        let now = moment();
        // get string representation of reading duration
        this.time = simpleDuration(moment.duration(now.diff(moment(this.reading.start))));
      }
    }, 1000);
  }

  /**
   * Dispatches action after start button has been clicked
   */
  start(): void {
    this.store.dispatch({type: trackingActions.ADDITIONAL.API_START, payload: {id: this.reading.bookId, readings: true}});
  }

  /**
   * Dispatches action after stop button has been clicked
   */
  stop(): void {
    this.store.dispatch({type: trackingActions.ADDITIONAL.API_END, payload: {id: this.reading.bookId, readings: true}});
  }

  /**
   * Redirect to the book detail section after bar has been clicked
   */
  redirectToDetail(): void {
    this.router.navigate([`platform/detail/${this.reading.bookId}`]);
  }
}
