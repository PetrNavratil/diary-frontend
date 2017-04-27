import { Component, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/cs';
import * as vis from 'vis';
import { Store } from '@ngrx/store';
import { AppState } from '../../shared/models/store-model';
import { SquirrelState } from '@flowup/squirrel';
import { readingsActions } from '../../reducers/reading.reducer';
import { Reading } from '../../shared/models/tracking.model';
import { statisticActions } from '../../reducers/statistic.reducer';
import { Statistic } from '../../shared/models/statistic.model';
import { getDurationFormat } from '../../shared/duration-format';
import { Subscription } from 'rxjs';
import { StatisticInterval } from '../../shared/models/statistic-interval.model';
import { intervalsActions } from '../../reducers/statistic-intervals.reducer';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class StatisticsComponent implements OnDestroy {

  months: Month[] = [];
  selectedMonth: Month;
  years: string[] = [];
  selectedYear: string;
  yearTimeline: any;
  monthTimeline: any;
  wholeTimeReading: Reading[] = [];
  intervals: StatisticInterval[] = [];
  intervalsLoading = false;
  readingsLoading = false;
  statistic: Statistic;
  subscriptions: Subscription[] = [];
  yearTimelineExpanded = false;
  monthTimelineExpanded = false;
  @ViewChild('yearTimeline') yearTimelineElement: ElementRef;
  @ViewChild('monthTimeline') monthTimelineElement: ElementRef;

  constructor(private store: Store<AppState>, private cd: ChangeDetectorRef) {
    moment.locale('cs');
    this.months = Array.from(Array(12).keys()).map(index => ({
      id: index,
      name: `${moment().month(index).format('MMMM')}`
    }));
    const now = moment();
    this.selectedMonth = {
      id: now.month(),
      name: now.format('MMMM')
    };
    this.selectedYear = now.format('YYYY');
    for (let i of [1, 2, 3, 4, 5]) {
      this.years.push(now.subtract(1, 'years').format('YYYY'));
    }
    this.years = [this.selectedYear, ...this.years];
    this.store.dispatch({type:readingsActions.API_GET });
    this.store.dispatch({type:statisticActions.API_GET });
    this.store.dispatch({type:intervalsActions.API_GET, payload:{month: this.selectedMonth.id + 1, year: this.selectedYear} });
    this.subscriptions.push(this.store.select('readings').subscribe(
      (data: SquirrelState<Reading>) => {
        this.readingsLoading = data.loading;
        if (data.error) {
          console.error(data.error);
        } else {
          if (data.data.length && !data.loading) {
            this.wholeTimeReading = data.data;
            this.createYearTimeline();
          }
        }
      }
    ));
    this.subscriptions.push(this.store.select('statistics').subscribe(
      (data: SquirrelState<Statistic>) => {
        if (data.error) {
          console.error(data.error);
        } else {
          if (data.data.length && !data.loading) {
            this.statistic = data.data[0];
            this.cd.markForCheck();
          }
        }
      }
    ));
    this.subscriptions.push(this.store.select('intervals').subscribe(
      (data: SquirrelState<StatisticInterval>) => {
        this.intervalsLoading = data.loading;
        if (data.error) {
          console.error(data.error);
        } else {
          if (!data.loading) {
            this.intervals = data.data;
            if(this.monthTimeline){
              this.monthTimeline.destroy();
              this.monthTimeline = null;
            }
            if (this.intervals.length) {
              this.createIntervalTimeline()
            }
          }
        }
        this.cd.markForCheck();
      }
    ));
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.store.dispatch({type: 'CLEAR'});
  }

  get spentReading() {
    return getDurationFormat(moment.duration(this.statistic.timeSpentReading));
  }

  selectMonth(month: Month) {
    this.selectedMonth = month;
    this.store.dispatch({type:intervalsActions.API_GET, payload:{month: this.selectedMonth.id + 1, year: this.selectedYear}});
  }

  selectYear(year: string) {
    this.selectedYear = year;
    this.yearTimeline.setOptions(this.createOptions(true));
    this.store.dispatch({type:intervalsActions.API_GET, payload:{month: this.selectedMonth.id + 1, year: this.selectedYear}});
  }

  createYearTimeline() {
    const groups = this.wholeTimeReading.filter((reading, index, readingArray: Reading[]) => {
      return readingArray.findIndex(rd => rd.bookId === reading.bookId) === index;
    }).map(tmpBook => ({
      id: tmpBook.bookId,
      content: tmpBook.title.replace(/\(.*\)/g, ''),
    }));
    const items = new vis.DataSet(this.wholeTimeReading.map((reading, index) => ({
      id: index,
      title: `${reading.title.replace(/\(.*\)/g, '')}`,
      content: `${reading.title.replace(/\(.*\)/g, '')}`,
      start: moment(reading.start),
      end: reading.completed ? moment(reading.stop) : moment(),
      group: reading.bookId
    })));
    // Create a Timeline
    this.yearTimeline = new vis.Timeline(
      this.yearTimelineElement.nativeElement,
      items,
      groups,
      this.createOptions(true));
  }

  createIntervalTimeline() {
    console.log('da fuq');
    const groups = this.intervals.filter((interval, index, intervalArray: StatisticInterval[]) => {
      return intervalArray.findIndex(intrvl => intrvl.bookId === interval.bookId) === index;
    }).map(tmpInterval => ({
      id: tmpInterval.bookId,
      content: tmpInterval.title.replace(/\(.*\)/g, ''),
    }));
    const items = new vis.DataSet(this.intervals.map((interval, index) => ({
      id: index,
      title: `${interval.title.replace(/\(.*\)/g, '')}`,
      content: `${interval.title.replace(/\(.*\)/g, '')}`,
      start: moment(interval.start),
      end: interval.completed ? moment(interval.stop) : moment(),
      group: interval.bookId
    })));
    console.log('items', items);
    console.log('groups', groups);
    this.monthTimeline = new vis.Timeline(
      this.monthTimelineElement.nativeElement,
      items,
      groups,
      this.createOptions(false));
  }

  createOptions(year: boolean): any {
    let opts = {
      moment: function (date) {
        return moment(date).locale('cs');
      },
      tooltip: {
        followMouse: true,
      },
      stack: false
    };
    if (year){
      opts['end'] = moment(+this.selectedYear + 1, 'YYYY');
      opts['start'] = moment(+this.selectedYear, 'YYYY');
    } else {
      opts['end'] = moment(this.selectedMonth.id +2, 'M');
      opts['start'] = moment(this.selectedMonth.id +1, 'M');
    }
    return opts;
  }

  monthExpanded(state: boolean){
    this.monthTimelineExpanded = state;
  }

  yearExpanded(state: boolean){
    this.yearTimelineExpanded = state;
  }

}

interface Month {
  id: number;
  name: string;
}


