import {
  Component, AfterViewChecked, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild,
  ElementRef
} from '@angular/core';
import { AppState } from '../../shared/models/store-model';
import { Store } from '@ngrx/store';
import { GRBook, GRSimilarBook } from '../../shared/models/goodreadsBook.model';
import * as Tether from 'tether';
import { SquirrelState } from '@flowup/squirrel';
import { ActivatedRoute, Router } from '@angular/router';
import { detailActions } from '../../reducers/book-detail.reducer';
import { booksActions } from '../../reducers/books.reducer';
import { Book, BookInfo } from '../../models/book.model';
import { BookStatus } from '../../models/book-status.enum';
import { DiaryComment } from '../../models/comment.model';
import { User } from '../../models/user.model';
import { commentActions } from '../../reducers/comments.reducer';
import { environment } from '../../../environments/environment';
import { createOptions } from '../../shared/createOptions';
import { Http } from '@angular/http';
import { EducationModel } from '../../models/education.model';
import { Shelf } from '../../models/shelf.model';
import { shelvesActions } from '../../reducers/shelves.reducer';
import { trackingActions } from '../../reducers/tracking.reducer';
import { StoredReading, Interval, Reading } from '../../models/tracking.model';
import * as moment from 'moment';
import 'moment/locale/cs';
import { getDurationFormat } from '../../shared/duration-format';
import { PdfService } from '../../shared/pdf.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookDetailComponent implements OnInit, AfterViewChecked, OnDestroy {

  book: GRBook;
  /**
   * Holds information about book from different resources
   */
  bookRes: BookInfo;
  bookInfo: Book;
  tether: Tether;
  tabs: string[] = [
    'GoodReads',
    'Google Books',
  ];
  bookResLoading = false;
  selectedTab: string = this.tabs[0];
  subscriptions: any[] = [];
  insertLoading: boolean = false;
  id: number;
  BookStatus = BookStatus;
  comments: DiaryComment[] = [];
  userComment: DiaryComment;
  user: User;
  similarBooks: Book[] = [];
  shelves: Shelf[] = [];
  inShelves: number[] = [];
  newShelf = '';
  trackings: StoredReading = {
    readings: [],
    lastInterval: null
  };
  updateDetail = false;
  showTimetamp = false;
  updateLatest = false;
  selectedReading = -1;
  trackingsLoading = true;

  // whole reading time  ... sum of all intervals
  wholeTimeReading = '';
  intervalsTableData: {start: string; stop: string; duration: string;}[] = [];
  // duration of selected reading
  readingDuration = '';
  // timestamps of start and stop of reading
  readingStartStop = '';
  educationalVisible = false;
  commentsLoading = false;

  @ViewChild('bookContainer') bookContainer: ElementRef;
  @ViewChild('sweeper') sweeper: ElementRef;

  constructor(private store: Store<AppState>,
              private route: ActivatedRoute,
              private router: Router,
              private http: Http,
              private cd: ChangeDetectorRef,
              private pdf: PdfService) {
    moment.locale('cs');
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.store.dispatch({type: 'CLEAR'});
      if (this.id) {
        this.store.dispatch({type: detailActions.API_GET , payload: this.id });
        this.store.dispatch({type: booksActions.ADDITIONAL.GET_SINGLE, payload: this.id});
        this.store.dispatch({type:commentActions.API_GET , payload: this.id});
        this.store.dispatch({type:shelvesActions.API_GET });
        this.store.dispatch({type: trackingActions.API_GET, payload: this.id});
      }
    });
    // user book info
    this.subscriptions.push(this.store.select('books')
      .subscribe(
        (data: SquirrelState<Book>) => {
          if (data.error) {
            console.error(data.error);
            return;
          } else {
            if (data.data.length && !data.loading) {
              this.bookInfo = data.data[0];
              if (this.updateLatest) {
                // updating latest because it was closed by changing status
                this.store.dispatch({type: trackingActions.ADDITIONAL.API_GET_LAST});
                this.updateLatest = false;
              }
            }
          }
          this.insertLoading = data.loading;
          this.cd.markForCheck();
        })
    );
    // book gr info
    this.subscriptions.push(this.store.select('detail')
      .subscribe(
        (data: SquirrelState<BookInfo>) => {
          this.bookResLoading = data.loading;
          if (data.error) {
            console.error(data.error);
          } else {
            if (data.data.length) {
              this.bookRes = data.data[0];
              this.book = Object.assign({}, data.data[0].goodReadsBook);
              this.sweeper.nativeElement.style.left = 0;
              if (this.book.similarBooks) {
                this.similarBooks = this.book.similarBooks.map((book: GRSimilarBook) => ({
                  id: book.id,
                  title: book.title,
                  author: book.authors[0].name,
                  imageUrl: book.imageUrl
                }));
              } else {
                this.similarBooks = [];
              }
              if (this.bookInfo) {
                if(this.bookInfo.educational.obsah.length === 0){
                  this.bookInfo.educational = Object.assign({}, this.bookInfo.educational, {obsah: this.book.description});
                }
                if(this.bookInfo.educational.hodnoceni.length === 0 && this.userComment.text.length > 0) {
                  this.bookInfo.educational = Object.assign({}, this.bookInfo.educational, {hodnoceni: this.userComment.text});
                }
              }
            }
          }
          this.cd.markForCheck();
        }
      )
    );

    // comments
    this.subscriptions.push(this.store.select('comments')
      .subscribe(
        (data: SquirrelState<DiaryComment>) => {
          this.commentsLoading = data.loading;
          if (data.error) {
            console.error(data.error);
          } else {
            if (this.user) {
              this.comments = data.data.filter(comment => comment.userId !== this.user.id);
              this.userComment = data.data.find(comment => comment.userId === this.user.id);
              if (!this.userComment) {
                this.userComment = {
                  userName: this.user.userName,
                  date: '',
                  text: '',
                  userAvatar: this.user.avatar,
                  bookId: this.id,
                  userId: this.user.id,
                  lastName: this.user.lastName,
                  firstName: this.user.firstName
                };
              }
            }
          }
          this.cd.markForCheck();
        })
    );

    // user info
    this.subscriptions.push(this.store.select('users')
      .subscribe(
        (data: SquirrelState<User>) => {
          if (data.error) {
            console.error(data.error);
          } else {
            if (data.data.length) {
              this.user = data.data[0];
            }
          }
          this.cd.markForCheck();
        })
    );

    // shelves
    this.subscriptions.push(this.store.select('shelves')
      .subscribe(
        (data: SquirrelState<Shelf>) => {
          if (data.error) {
            console.error(data.error);
          } else {
            this.newShelf = '';
            this.shelves = data.data;
            this.inShelves = this.shelves.filter(shelve => shelve.books.some(book => book.id === this.id)).map(shelve => shelve.id);
          }
        this.cd.markForCheck();
        })
    );

    this.subscriptions.push(this.store.select('tracking')
      .subscribe(
        (data: SquirrelState<StoredReading>) => {
          this.trackingsLoading = data.loading;
          if (data.error) {
            console.error(data.error);
          } else {
            if (data.data.length && !data.loading) {
              this.trackings = data.data[0];
              this.selectedReading = this.trackings.readings.length ? this.trackings.readings.length - 1 : -1;
              if (this.trackings.lastInterval.start) {
                if (this.id !== this.trackings.lastInterval.bookId) {
                  this.showTimetamp = false;
                } else {
                  this.showTimetamp = !this.trackings.lastInterval.completed;
                }
              }
              if (this.updateDetail) {
                this.store.dispatch({type:booksActions.ADDITIONAL.GET_SINGLE, payload: this.id });
                this.updateDetail = false;
              }
              if(this.trackings.readings.length){
                this.wholeTimeReading = getDurationFormat(moment.duration(this.trackings.readings.map(reading => this.getReadingDuration(reading.intervals)).reduce(
                  (acc, val) => acc.add(val), moment.duration(0)
                )));
                this.intervalsTableData = this.createIntervalsTableData(this.trackings.readings[this.selectedReading].intervals);
                this.readingDuration = this.getTimeStampsDurationFormatted(
                  this.getReadingDuration(this.trackings.readings[this.selectedReading].intervals)
                );
                this.readingStartStop = this.getReadingStartStop(this.trackings.readings[this.selectedReading]);
              }
            }
          }
          this.cd.markForCheck();
        })
    );
  }

  /**
   * Returns reading FROM - TO or FROM
   * @param reading
   * @returns {string}
   */
  getReadingStartStop(reading: Reading): string{
    if (reading.completed) {
      return `${this.getFormattedTimeStamp(reading.start)} - ${this.getFormattedTimeStamp(reading.stop)}`;
    } else {
      return this.getFormattedTimeStamp(reading.start);
    }
  }

  /**
   * Returns formatted timestamp in LLL format
   * @param timestamp
   * @returns {string}
   */
  getFormattedTimeStamp(timestamp: string): string {
    return timestamp !== '0001-01-01T00:00:00Z' ? moment(timestamp).format('LLL') : '-';
  }

  /**
   * Returns duration of two timestamps
   * @param start
   * @param stop
   * @returns {Duration}
   */
  getTimeStampsDuration(start: string, stop: string): moment.Duration {
    if (stop === '0001-01-01T00:00:00Z') {
      return moment.duration(0)
    } else {
      return moment.duration(moment(stop).diff(moment(start)));
    }
  }

  /**
   * Returns formatted duration
   * @param duration
   * @returns {string}
   */
  getTimeStampsDurationFormatted(duration: moment.Duration): string {
    if (duration.as('milliseconds') > 0) {
      return getDurationFormat(duration);
    } else {
      return '-';
    }
  }

  getReadingDuration(intervals: Interval[]) {
    return intervals.reduce(
      (acc: moment.Duration,interval: Interval) => acc.add(this.getTimeStampsDuration(interval.start, interval.stop)), moment.duration(0))
  }

  createIntervalsTableData(intervals: Interval[]) {
    return intervals
      .map(interval => ({
        start: this.getFormattedTimeStamp(interval.start),
        stop: this.getFormattedTimeStamp(interval.stop),
        duration: this.getTimeStampsDurationFormatted(this.getTimeStampsDuration(interval.start, interval.stop))
      }));
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.store.dispatch({type: 'CLEAR'});
  }

  ngOnInit() {
    this.tether = new Tether({
      element: '.triangle',
      target: '.tabs-container',
      attachment: 'top left',
      targetAttachment: 'top right',
      enabled: false
    })
  }

  ngAfterViewChecked() {
    this.tether.enable();
    this.tether.position();
  }

  selectTab(index: string) {
    this.selectedTab = index;
    let offset = this.tabs.indexOf(index) * 40;
    this.tether.setOptions({
      element: '.triangle',
      target: '.tabs-container',
      attachment: 'top left',
      targetAttachment: 'top right',
      targetOffset: `${offset}px 0`
    });
  }

  addBook() {
    this.store.dispatch({type:booksActions.API_CREATE , payload:this.id});
  }

  removeBook() {
    this.store.dispatch({type:booksActions.API_DELETE , payload:this.id});
    this.updateLatest = true;
    this.trackings.readings = [];
  }

  changeStatus(status: number) {
    if (this.bookInfo.status === status) {
      return;
    }
    if (this.bookInfo.status === BookStatus.READING && status !== BookStatus.READ) {
      return;
    }
    if (status === BookStatus.READ && this.trackings.lastInterval.bookId === this.id) {
      this.updateLatest = true;
    }
    this.bookInfo.status = status;
    this.store.dispatch({type:booksActions.API_UPDATE , payload:this.bookInfo});
  }

  editComment(item: any) {
    this.store.dispatch({type:commentActions.API_UPDATE , payload:item});
  }

  addComment(item: any) {
    this.store.dispatch({type:commentActions.API_CREATE , payload:item});
  }

  deleteComment(item: any) {
    this.store.dispatch({type:commentActions.API_DELETE , payload:item});
  }

  goToBook(book: Book) {
    this.http.post(`${environment.apiUrl}/book`, book, createOptions()).subscribe(
      data => {
        this.router.navigate([`platform/detail/${data.json().id}`]);
      }
    );
  }

  setEducational(educational: EducationModel) {
    this.bookInfo.educational = educational;
    this.store.dispatch({type:booksActions.API_UPDATE , payload:this.bookInfo});
  }

  isInShelve(id: number): boolean {
    return this.inShelves.indexOf(id) > -1 ? true : false;
  }

  toggleShelf(id: number) {
    if (this.isInShelve(id)) {
      this.store.dispatch({type:shelvesActions.ADDITIONAL.API_REMOVE_BOOK , payload:{id: id, book: this.bookInfo}});
    } else {
      this.store.dispatch({type:shelvesActions.ADDITIONAL.API_ADD_BOOK , payload:{id: id, book: this.bookInfo}});
    }
  }

  addNewShelf(event) {
    event.stopPropagation();
    if (this.newShelf.length > 0) {
      this.store.dispatch({type:shelvesActions.API_CREATE , payload:{name: this.newShelf}});
    }
  }

  startTracking() {
    this.store.dispatch({type:trackingActions.ADDITIONAL.API_START , payload:{id: this.id, readings: true}});
    // update only if book wasnt reading
    if (this.bookInfo.status !== BookStatus.READING) {
      this.updateDetail = true;
    }
  }

  stopTracking() {
    this.store.dispatch({type:trackingActions.ADDITIONAL.API_END , payload:{id: this.id, readings: true}});
  }


  selectReading(index: number) {
    this.selectedReading = index;
    this.intervalsTableData = this.createIntervalsTableData(this.trackings.readings[this.selectedReading].intervals);
    this.readingDuration = this.getTimeStampsDurationFormatted(
      this.getReadingDuration(this.trackings.readings[this.selectedReading].intervals)
    );
    this.readingStartStop = this.getReadingStartStop(this.trackings.readings[this.selectedReading]);
  }

  get existThisShelf() {
    return this.shelves.filter(shelf => shelf.name === this.newShelf).length === 1;
  }

  generatePdf(){
  this.pdf.generateBookDetailPdf(this.id);
  }

  changeEducationalVisibility(status: string){
    this.educationalVisible = status === 'expanded';
  }

  interval: any;

  shiftLeft(){
    this.interval = setInterval(() => {
      let left = +this.sweeper.nativeElement.style.left.replace('px', '');
      let visibleWidth = this.sweeper.nativeElement.offsetWidth + left;
      if (visibleWidth + 50 < this.bookContainer.nativeElement.offsetWidth){
        return;
      } else {
        this.sweeper.nativeElement.style.left = left - 20 + 'px';
      }
    }, 80);
  }

  shiftRight(){
    this.interval = setInterval(() => {
      let left = +this.sweeper.nativeElement.style.left.replace('px', '');
      if(left != 0){
        this.sweeper.nativeElement.style.left = left + 20 + 'px';
      }
    }, 80);
  }

  stopShift(){
    clearInterval(this.interval);
  }

}
