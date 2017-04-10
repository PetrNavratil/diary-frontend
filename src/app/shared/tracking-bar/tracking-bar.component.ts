import { Component, OnInit } from '@angular/core';
import { AppState } from '../models/store-model';
import { Store } from '@ngrx/store';
import { ComponentDispatcher, squirrel, SquirrelData } from '@flowup/squirrel';
import { StoredReading, Reading } from '../models/tracking.model';
import { trackingActions } from '../../reducers/tracking.reducer';
import * as moment from 'moment'
import { User } from '../models/user.model';

@Component({
  selector: 'app-tracking-bar',
  templateUrl: './tracking-bar.component.html',
  styleUrls: ['./tracking-bar.component.scss']
})
export class TrackingBarComponent {

  dispatcher: ComponentDispatcher;
  subscriptions: any[] = [];
  reading: Reading;
  time: string = '';
  getLast: boolean = true;

  constructor(private store: Store<AppState>) {
    this.dispatcher = new ComponentDispatcher(store, this);
    let {dataStream: trackingData, errorStream: trackingError} = squirrel(store, 'tracking', this);
    let {dataStream: userData, errorStream: userError} = squirrel(store, 'users', this);

    this.subscriptions.push(
      userData.subscribe(
        (data: SquirrelData<User>) => {
          if (this.getLast && data.data.length && !data.loading) {
            this.getLast = false;
            this.dispatcher.dispatch(trackingActions.ADDITIONAL.API_GET_LAST);
          }
        }
      ));


    this.subscriptions.push(
      trackingData.subscribe(
        (data: SquirrelData<StoredReading>) => {
          if (data.data[0].lastInterval.bookId > 0) {
            this.reading = data.data[0].lastInterval;
          }
        }
      ));
    this.subscriptions.push(
      trackingError.subscribe(
        (error: Error) => {
          console.error(error);
        }
      )
    );

    setInterval(() => {
      if (this.reading && !this.reading.completed) {
        let now = moment();
        let diff = now.diff(moment(this.reading.start));
        this.time = moment.utc(moment.duration(diff).asMilliseconds()).format("HH:mm:ss");
      }
    }, 1000);

  }

  start() {
    this.dispatcher.dispatch(trackingActions.ADDITIONAL.API_START, {id: this.reading.bookId, readings: true});
  }

  stop() {
    this.dispatcher.dispatch(trackingActions.ADDITIONAL.API_END, {id: this.reading.bookId, readings: true});
  }

}
