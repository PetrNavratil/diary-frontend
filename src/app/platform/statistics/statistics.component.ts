import { Component, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/cs';
import * as vis from 'vis';
import { Store } from '@ngrx/store';
import { AppState } from '../../shared/models/store-model';
import { ComponentDispatcher, SquirrelState } from '@flowup/squirrel';
import { readingsActions } from '../../reducers/reading.reducer';
import { Reading } from '../../shared/models/tracking.model';
import { statisticActions } from '../../reducers/statistic.reducer';
import { Statistic } from '../../shared/models/statistic.model';
import { getDurationFormat } from '../../shared/duration-format';
import { Subscription } from 'rxjs';

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
  update = false;
  dispatcher: ComponentDispatcher;
  wholeTimeReading: Reading[] = [];
  statistic: Statistic;
  subscriptions: Subscription[] = [];
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
    this.dispatcher = new ComponentDispatcher(store, this);
    this.dispatcher.dispatch(readingsActions.API_GET);
    this.dispatcher.dispatch(statisticActions.API_GET);
    this.subscriptions.push(this.store.select('readings').subscribe(
      (data: SquirrelState<Reading>) => {
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
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  get spentReading() {
    console.log('sup', this.statistic.timeSpentReading);
    console.log(getDurationFormat(moment.duration(this.statistic.timeSpentReading)))
    return getDurationFormat(moment.duration(this.statistic.timeSpentReading));
  }

  selectMonth(month: Month) {
    this.selectedMonth = month;
    this.update = true;
  }

  selectYear(year: string) {
    this.selectedYear = year;
    this.yearTimeline.setOptions(this.createOptions());
    this.update = true;
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
    console.log('items', items);
    console.log('groups', groups);
    // Create a Timeline
    this.yearTimeline = new vis.Timeline(
      this.yearTimelineElement.nativeElement,
      items,
      groups,
      this.createOptions());
  }

  createOptions(): any {
    return {
      end: moment(+this.selectedYear + 1, 'YYYY'),
      start: moment(+this.selectedYear, 'YYYY'),
      moment: function (date) {
        return moment(date).locale('cs');
      },
      tooltip: {
        followMouse: true,
      },
      stack: false
    }
  }

}

interface Month {
  id: number;
  name: string;
}


