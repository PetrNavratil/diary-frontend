import { Component, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/cs';
import * as vis from 'vis';
import { Store } from '@ngrx/store';
import { AppState } from '../../models/store-model';
import { SquirrelState } from '@flowup/squirrel';
import { readingsActions } from '../../reducers/reading.reducer';
import { Reading } from '../../models/tracking.model';
import { statisticActions } from '../../reducers/statistic.reducer';
import { Statistic } from '../../models/statistic.model';
import { getDurationFormat } from '../../shared/duration-format';
import { Subscription } from 'rxjs';
import { StatisticInterval } from '../../models/statistic-interval.model';
import { intervalsActions } from '../../reducers/statistic-intervals.reducer';
import { LanguageService } from '../../shared/language.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class StatisticsComponent implements OnDestroy {

  /**
   * Array of months
   * @type {Month[]}
   */
  months: Month[] = [];
  /**
   * Selected month
   * @type {Month}
   */
  selectedMonth: Month;
  /**
   * Array of years
   * @type {string[]}
   */
  years: string[] = [];
  /**
   * Selected year
   * @type {string}
   */
  selectedYear: string;
  /**
   * Holds object of year timeline
   */
  yearTimeline: any;
  /**
   * Holds object of month timeline
   */
  monthTimeline: any;
  /**
   * User's readings
   * @type {Reading[]}
   */
  wholeTimeReading: Reading[] = [];
  /**
   * User's reading interval for selected period
   * @type {StatisticInterval[]}
   */
  intervals: StatisticInterval[] = [];
  /**
   * States whether interval data are loading
   * @type {boolean}
   */
  intervalsLoading = false;
  /**
   * States wheter reading data are loading
   * @type {boolean}
   */
  readingsLoading = false;
  /**
   * Holds user's statistic summary data
   * @type {Statistic}
   */
  statistic: Statistic;
  /**
   * Store subscriptions
   * @type {Subscription[]}
   */
  subscriptions: Subscription[] = [];
  /**
   * States whether year timeline is expanded
   * @type {boolean}
   */
  yearTimelineExpanded = false;
  /**
   * States whether month timeline is expanded
   * @type {boolean}
   */
  monthTimelineExpanded = false;
  /**
   * Holds year timeline element
   * @type {ElementRef}
   */
  @ViewChild('yearTimeline') yearTimelineElement: ElementRef;
  /**
   * Holds month timeline element
   * @type {ElementRef}
   */
  @ViewChild('monthTimeline') monthTimelineElement: ElementRef;

  constructor(private store: Store<AppState>, private cd: ChangeDetectorRef, private language: LanguageService) {
    // creates array of months based on current language
    this.months = Array.from(Array(12).keys()).map(index => ({
      id: index,
      name: `${moment().month(index).format('MMMM')}`
    }));
    // sets current month
    const now = moment();
    this.selectedMonth = {
      id: now.month(),
      name: now.format('MMMM')
    };
    // sets years array
    this.selectedYear = now.format('YYYY');
    for (let i of [1, 2, 3, 4, 5]) {
      this.years.push(now.subtract(1, 'years').format('YYYY'));
    }
    this.years = [this.selectedYear, ...this.years];
    // gets data
    this.store.dispatch({type: readingsActions.API_GET});
    this.store.dispatch({type: statisticActions.API_GET});
    this.store.dispatch({type: intervalsActions.API_GET, payload: {month: this.selectedMonth.id + 1, year: this.selectedYear}});
    // subscribe to the readings
    this.subscriptions.push(this.store.select('readings').subscribe(
      (data: SquirrelState<Reading>) => {
        this.readingsLoading = data.loading;
        if (data.error) {
          console.error(data.error);
        } else {
          if (data.data.length && !data.loading) {
            this.wholeTimeReading = data.data;
            // redraws whole time reading
            this.createYearTimeline();
          }
        }
      }
    ));
    // subscribes to the statistics
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
    // subscribes to the intervals
    this.subscriptions.push(this.store.select('intervals').subscribe(
      (data: SquirrelState<StatisticInterval>) => {
        this.intervalsLoading = data.loading;
        if (data.error) {
          console.error(data.error);
        } else {
          if (!data.loading) {
            this.intervals = data.data;
            // if month timeline exists, destroy it
            if (this.monthTimeline) {
              this.monthTimeline.destroy();
              this.monthTimeline = null;
            }
            if (this.intervals.length) {
              // create interval timeline
              this.createIntervalTimeline()
            }
          }
        }
        this.cd.markForCheck();
      }
    ));
  }

  /**
   * Gets time spent reading since registration
   * @returns {string}
   */
  get spentReading(): string {
    return getDurationFormat(moment.duration(this.statistic.timeSpentReading), this.language.getCurrent());
  }

  /**
   * Sets selected month after button has been clicked
   * @param month
   */
  selectMonth(month: Month): void {
    this.selectedMonth = month;
    // refresh data for new period
    this.store.dispatch({type: intervalsActions.API_GET, payload: {month: this.selectedMonth.id + 1, year: this.selectedYear}});
  }

  /**
   * Sets selected year after button has been clicked
   * @param year
   */
  selectYear(year: string): void {
    this.selectedYear = year;
    // set x axis of yeartimeline to start at selected year
    this.yearTimeline.setOptions(this.createOptions(true));
    // refresh data for new period
    this.store.dispatch({type: intervalsActions.API_GET, payload: {month: this.selectedMonth.id + 1, year: this.selectedYear}});
  }

  /**
   * Creates year timeline
   */
  createYearTimeline(): void {
    // creates groups for timeline, group is book with all its readings
    const groups = this.wholeTimeReading.filter((reading, index, readingArray: Reading[]) => {
      return readingArray.findIndex(rd => rd.bookId === reading.bookId) === index;
    }).map(tmpBook => ({
      // id of book and its name
      id: tmpBook.bookId,
      content: tmpBook.title.replace(/\(.*\)/g, ''),
    }));
    // create items for timeline
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

  /**
   * Creates period interval timeline
   */
  createIntervalTimeline(): void {
    // creates groups for timeline, group is book with all its readings
    const groups = this.intervals.filter((interval, index, intervalArray: StatisticInterval[]) => {
      return intervalArray.findIndex(intrvl => intrvl.bookId === interval.bookId) === index;
    }).map(tmpInterval => ({
      id: tmpInterval.bookId,
      content: tmpInterval.title.replace(/\(.*\)/g, ''),
    }));
    // create items for timeline
    const items = new vis.DataSet(this.intervals.map((interval, index) => ({
      id: index,
      title: `${interval.title.replace(/\(.*\)/g, '')}`,
      content: `${interval.title.replace(/\(.*\)/g, '')}`,
      start: moment(interval.start),
      end: interval.completed ? moment(interval.stop) : moment(),
      group: interval.bookId
    })));
    // create timeline
    this.monthTimeline = new vis.Timeline(
      this.monthTimelineElement.nativeElement,
      items,
      groups,
      this.createOptions(false));
  }

  /**
   * Creates option for timeline
   * @param year
   * @returns {{moment: ((date:any)=>any), tooltip: {followMouse: boolean}, stack: boolean}}
   */
  createOptions(year: boolean): any {
    let opts = {
      // use selected language location
      moment: (date) => moment(date).locale(this.language.getCurrent()),
      tooltip: {
        followMouse: true,
      },
      stack: false
    };
    if (year) {
      opts['end'] = moment(+this.selectedYear + 1, 'YYYY');
      opts['start'] = moment(+this.selectedYear, 'YYYY');
    } else {
      opts['end'] = moment(this.selectedMonth.id + 2, 'M');
      opts['start'] = moment(this.selectedMonth.id + 1, 'M');
    }
    return opts;
  }

  /**
   * Sets state of month timeline
   * @param state
   */
  monthExpanded(state: boolean): void {
    this.monthTimelineExpanded = state;
  }

  /**
   * Sets state of year timeline
   * @param state
   */
  yearExpanded(state: boolean): void {
    this.yearTimelineExpanded = state;
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.store.dispatch({type: 'CLEAR'});
  }

}

interface Month {
  id: number;
  name: string;
}


