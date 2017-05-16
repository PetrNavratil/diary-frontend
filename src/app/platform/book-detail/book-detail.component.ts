import {
  Component, AfterViewChecked, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild,
  ElementRef
} from '@angular/core';
import { AppState } from '../../models/store-model';
import { Store } from '@ngrx/store';
import { GRSimilarBook } from '../../models/goodreadsBook.model';
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
import { getDurationFormat } from '../../shared/duration-format';
import { PdfService } from '../../shared/pdf.service';
import { LanguageService } from '../../shared/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookDetailComponent implements OnInit, AfterViewChecked, OnDestroy {

  /**
   * Holds information about book from different resources
   * @type {BookInfo}
   */
  bookRes: BookInfo;
  /**
   * Information abour user book
   * @type {Book}
   */
  bookInfo: Book;
  /**
   * Arrow of tabs
   * @type {Tether}
   */
  tether: Tether;
  /**
   * Texts for tab
   * @type {string[]}
   */
  tabs: string[] = [
    'GoodReads',
    'Google Books',
  ];
  /**
   * Loading of gr/gb resource
   * @type {boolean}
   */
  bookResLoading = false;
  /**
   * Currently selected tab
   * @type {string}
   */
  selectedTab: string = this.tabs[0];
  /**
   * Array of subscriptions to the store
   * @type {Subscription[]}
   */
  subscriptions: Subscription[] = [];
  /**
   * Loading of user book info
   * @type {boolean}
   */
  userBookLoading: boolean = false;
  /**
   * Id of displayed book
   * @type {number}
   */
  id: number;
  /**
   * Enum of book statuses for use in template
   * @type {BookStatus}
   */
  BookStatus = BookStatus;
  /**
   * Array with books comments
   * @type {DiaryComment[]}
   */
  comments: DiaryComment[] = [];
  /**
   * User's comment
   * @type {DiaryComment}
   */
  userComment: DiaryComment;
  /**
   * User information
   * @type {User}
   */
  user: User;
  /**
   * Recommended books by Goodreads
   * @type {Book[]}
   */
  similarBooks: Book[] = [];
  /**
   * User's shelves
   * @type {Shelf[]}
   */
  shelves: Shelf[] = [];
  /**
   * Array of book's current shelves
   * @type {number[]}
   */
  inShelves: number[] = [];
  /**
   * Name of new shelf
   * @type {string}
   */
  newShelf = '';
  /**
   * Holds information about book tracking including latest tracking
   * @type {{readings: Array; lastInterval: any}}
   */
  trackings: StoredReading = {
    readings: [],
    lastInterval: null
  };
  /**
   * States whether datail should be updated
   * @type {boolean}
   */
  updateDetail = false;
  /**
   * States what tracking button should be visible
   * @type {boolean}
   */
  showTimetamp = false;
  /**
   * States wether latest tracking should be updated
   * @type {boolean}
   */
  updateLatest = false;
  /**
   * Holds selected reading of book
   * @type {number}
   */
  selectedReading = -1;
  /**
   * States whether tracking is loading
   * @type {boolean}
   */
  trackingsLoading = true;

  /**
   * whole reading time  ... sum of all intervals
   * @type {string}
   */
  wholeTimeReading = '';
  /**
   * Array of objects for interval table
   * @type {Array}
   */
  intervalsTableData: {start: string; stop: string; duration: string;}[] = [];
  /**
   * Duration of selected reading
   * @type {string}
   */
  readingDuration = '';
  /**
   * Timestamps of start and stop of reading
   * @type {string}
   */
  readingStartStop = '';
  /**
   * States wether literary analisis is visible
   * @type {boolean}
   */
  educationalVisible = false;
  /**
   * Loading of comment section
   * @type {boolean}
   */
  commentsLoading = false;

  /**
   * Holds book container element
   * @type {ElementRef}
   */
  /**
   * Used when setting interval to shift right/left of sweeper element
   */
  interval: any;
  @ViewChild('bookContainer') bookContainer: ElementRef;
  /**
   * Holds sweeper element
   * @type {ElementRef}
   */
  @ViewChild('sweeper') sweeper: ElementRef;

  constructor(private store: Store<AppState>,
              private route: ActivatedRoute,
              private router: Router,
              private http: Http,
              private cd: ChangeDetectorRef,
              private language: LanguageService,
              private pdf: PdfService) {
    // subscribe to the route for id
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      // clears store
      this.store.dispatch({type: 'CLEAR'});
      if (this.id) {
        // get required data from server
        this.store.dispatch({type: detailActions.API_GET, payload: this.id});
        this.store.dispatch({type: booksActions.ADDITIONAL.GET_SINGLE, payload: this.id});
        this.store.dispatch({type: commentActions.API_GET, payload: this.id});
        this.store.dispatch({type: shelvesActions.API_GET});
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
          this.userBookLoading = data.loading;
          this.cd.markForCheck();
        })
    );
    // book gr/fb info
    this.subscriptions.push(this.store.select('detail')
      .subscribe(
        (data: SquirrelState<BookInfo>) => {
          this.bookResLoading = data.loading;
          if (data.error) {
            console.error(data.error);
          } else {
            if (data.data.length) {
              this.bookRes = data.data[0];
              // set sweeper to detail
              this.sweeper.nativeElement.style.left = 0;
              // get recommended books
              if (this.bookRes.goodReadsBook.similarBooks) {
                this.similarBooks = this.bookRes.goodReadsBook.similarBooks.map((book: GRSimilarBook) => ({
                  id: book.id,
                  title: book.title,
                  author: book.authors[0].name,
                  imageUrl: book.imageUrl
                }));
              } else {
                this.similarBooks = [];
              }
              // if bookinfo is already set
              if (this.bookInfo) {
                // set description as obsah
                if (this.bookInfo.educational.obsah.length === 0) {
                  this.bookInfo.educational = Object.assign({}, this.bookInfo.educational, {obsah: this.bookRes.goodReadsBook.description});
                }
                // set comment as hodnoceni
                if (this.bookInfo.educational.hodnoceni.length === 0 && this.userComment.text.length > 0) {
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
              // get not users comment
              this.comments = data.data.filter(comment => comment.userId !== this.user.id);
              // get user's comment
              this.userComment = data.data.find(comment => comment.userId === this.user.id);
              // prepare empty comment if user hasn't commended yet
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
            // get shelves in which book already is
            this.inShelves = this.shelves.filter(shelve => shelve.books.some(book => book.id === this.id)).map(shelve => shelve.id);
          }
          this.cd.markForCheck();
        })
    );

    // get tracking of book
    this.subscriptions.push(this.store.select('tracking')
      .subscribe(
        (data: SquirrelState<StoredReading>) => {
          this.trackingsLoading = data.loading;
          if (data.error) {
            console.error(data.error);
          } else {
            if (data.data.length && !data.loading) {
              this.trackings = data.data[0];
              // set latest reading as selected
              this.selectedReading = this.trackings.readings.length ? this.trackings.readings.length - 1 : -1;
              // if latest tracking is set
              if (this.trackings.lastInterval.start) {
                // if this book is the latest tracked book show stop tracking button
                if (this.id !== this.trackings.lastInterval.bookId) {
                  this.showTimetamp = false;
                } else {
                  this.showTimetamp = !this.trackings.lastInterval.completed;
                }
              }
              // if user book should be updated - after start of tracking undread book
              if (this.updateDetail) {
                this.store.dispatch({type: booksActions.ADDITIONAL.GET_SINGLE, payload: this.id});
                this.updateDetail = false;
              }
              if (this.trackings.readings.length) {
                // gets time spent reading
                this.wholeTimeReading = getDurationFormat(moment.duration(this.trackings.readings.map(reading => this.getReadingDuration(reading.intervals)).reduce(
                  (acc, val) => acc.add(val), moment.duration(0)
                )), this.language.getCurrent());
                // creates data for table
                this.intervalsTableData = this.createIntervalsTableData(this.trackings.readings[this.selectedReading].intervals);
                // gets time spent reading for selected reading
                this.readingDuration = this.getTimeStampsDurationFormatted(
                  this.getReadingDuration(this.trackings.readings[this.selectedReading].intervals)
                );
                // gets period of selected reading
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
  getReadingStartStop(reading: Reading): string {
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
      return getDurationFormat(duration, this.language.getCurrent());
    } else {
      return '-';
    }
  }

  /**
   * Gets duration of all intervals of reading
   * @param intervals
   * @returns {moment.Duration}
   */
  getReadingDuration(intervals: Interval[]): moment.Duration {
    return intervals.reduce(
      (acc: moment.Duration, interval: Interval) => acc.add(this.getTimeStampsDuration(interval.start, interval.stop)), moment.duration(0))
  }

  /**
   * Creates data for table
   * @param intervals
   * @returns {{start: string, stop: string, duration: string}[]}
   */
  createIntervalsTableData(intervals: Interval[]): any {
    return intervals
      .map(interval => ({
        start: this.getFormattedTimeStamp(interval.start),
        stop: this.getFormattedTimeStamp(interval.stop),
        duration: this.getTimeStampsDurationFormatted(this.getTimeStampsDuration(interval.start, interval.stop))
      }));
  }

  /**
   * Selects click tab option
   * @param index
   */
  selectTab(index: string): void {
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

  /**
   * Dispatches action after add book button is clicked
   */
  addBook(): void {
    this.store.dispatch({type: booksActions.API_CREATE, payload: this.id});
  }

  /**
   * Dispatches action after remove book button is clicked
   */
  removeBook(): void {
    this.store.dispatch({type: booksActions.API_DELETE, payload: this.id});
    this.updateLatest = true;
    this.trackings.readings = [];
  }

  /**
   * Dispatches action after status option button is clicked
   * @param status
   */
  changeStatus(status: number) {
    if (this.bookInfo.status === status) {
      return;
    }
    // reading book can't be only stopped reading
    if (this.bookInfo.status === BookStatus.READING && status !== BookStatus.READ) {
      return;
    }
    // ending of reading and book is also curentlu reading
    if (status === BookStatus.READ && this.trackings.lastInterval.bookId === this.id) {
      this.updateLatest = true;
    }
    this.bookInfo.status = status;
    this.store.dispatch({type: booksActions.API_UPDATE, payload: this.bookInfo});
  }

  /**
   * Dispatches action after edit comment event
   * @param item
   */
  editComment(item: any): void {
    this.store.dispatch({type: commentActions.API_UPDATE, payload: item});
  }

  /**
   * Dispatches action after after add comment event
   * @param item
   */
  addComment(item: any): void {
    this.store.dispatch({type: commentActions.API_CREATE, payload: item});
  }

  /**
   * Dispatches action after after delete comment event
   * @param item
   */
  deleteComment(item: any): void {
    this.store.dispatch({type: commentActions.API_DELETE, payload: item});
  }

  /**
   * Sends request to add new book to the database after click on this book in recommended section
   * Redirect to the clicked book
   * @param book
   */
  goToBook(book: Book): void {
    this.http.post(`${environment.apiUrl}/book`, book, createOptions()).subscribe(
      data => {
        this.router.navigate([`platform/detail/${data.json().id}`]);
      }
    );
  }

  /**
   * Stores edited educational after event is emitted
   * Dispatches action after
   * @param educational
   */
  setEducational(educational: EducationModel): void {
    this.bookInfo.educational = educational;
    this.store.dispatch({type: booksActions.API_UPDATE, payload: this.bookInfo});
  }

  /**
   * Checke whether book is in shelf specified by id
   * @param id
   * @returns {boolean}
   */
  isInShelve(id: number): boolean {
    return this.inShelves.indexOf(id) > -1 ? true : false;
  }

  /**
   * Dispatches action to add or remove book from shelf selected by id
   * @param id
   */
  toggleShelf(id: number): void {
    if (this.isInShelve(id)) {
      this.store.dispatch({type: shelvesActions.ADDITIONAL.API_REMOVE_BOOK, payload: {id: id, book: this.bookInfo}});
    } else {
      this.store.dispatch({type: shelvesActions.ADDITIONAL.API_ADD_BOOK, payload: {id: id, book: this.bookInfo}});
    }
  }

  /**
   * Dispatches action to create new shelf
   * @param event
   */
  addNewShelf(event): void {
    event.stopPropagation();
    if (this.newShelf.length > 0) {
      this.store.dispatch({type: shelvesActions.API_CREATE, payload: {name: this.newShelf}});
    }
  }

  /**
   * Dispatches action to start tracking of book
   */
  startTracking(): void {
    this.store.dispatch({type: trackingActions.ADDITIONAL.API_START, payload: {id: this.id, readings: true}});
    // update only if book wasnt reading
    if (this.bookInfo.status !== BookStatus.READING) {
      this.updateDetail = true;
    }
  }

  /**
   * Dispatches action to stop tracking of book
   */
  stopTracking(): void {
    this.store.dispatch({type: trackingActions.ADDITIONAL.API_END, payload: {id: this.id, readings: true}});
  }

  /**
   * Selects new reading after click on reading dropdown option
   * @param index
   */
  selectReading(index: number): void {
    // sets index
    this.selectedReading = index;
    // creates new data for intervals table
    this.intervalsTableData = this.createIntervalsTableData(this.trackings.readings[this.selectedReading].intervals);
    // gets reading time of selected reading
    this.readingDuration = this.getTimeStampsDurationFormatted(
      this.getReadingDuration(this.trackings.readings[this.selectedReading].intervals)
    );
    // gets period of selected reading
    this.readingStartStop = this.getReadingStartStop(this.trackings.readings[this.selectedReading]);
  }

  /**
   * Check if name of shelve already exist
   * @returns {boolean}
   */
  get existThisShelf(): boolean {
    return this.shelves.filter(shelf => shelf.name === this.newShelf).length === 1;
  }

  /**
   * Call to generate book detail pdf after click on button
   */
  generatePdf(): void {
    this.pdf.generateBookDetailPdf(this.id);
  }

  /**
   * Changes visibility of education to show proper tooltip
   * @param status
   */
  changeEducationalVisibility(status: boolean): void {
    this.educationalVisible = status;
  }

  /**
   * Moves sweeper to the left when mouse if pressed
   */
  shiftLeft(): void {
    // sets interval of moving
    this.interval = setInterval(() => {
      // gets left position
      let left = +this.sweeper.nativeElement.style.left.replace('px', '');
      // gets width of sweeper
      let visibleWidth = this.sweeper.nativeElement.offsetWidth + left;
      // if sweeper is not fully left, shift it
      if (visibleWidth + 50 < this.bookContainer.nativeElement.offsetWidth) {
        return;
      } else {
        this.sweeper.nativeElement.style.left = left - 20 + 'px';
      }
    }, 80);
  }

  /**
   * Moves sweeper to the right when mouse is pressed
   */
  shiftRight(): void {
    // sets interval of moving
    this.interval = setInterval(() => {
      // get left position
      let left = +this.sweeper.nativeElement.style.left.replace('px', '');
      // if sweeper is not fully right, shift it
      if (left != 0) {
        this.sweeper.nativeElement.style.left = left + 20 + 'px';
      }
    }, 80);
  }

  /**
   * Stops moving of sweeper after mouse is released
   */
  stopShift(): void {
    // removes interval
    clearInterval(this.interval);
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

}
