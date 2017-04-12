import { Component, AfterViewChecked, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AppState } from '../../shared/models/store-model';
import { Store } from '@ngrx/store';
import { GRBook, GRSimilarBook } from '../../shared/models/goodreadsBook.model';
import * as Tether from 'tether';
import { ComponentDispatcher, foxy, SquirrelState } from '@flowup/squirrel';
import { ActivatedRoute, Router } from '@angular/router';
import { detailActions } from '../../reducers/book-detail.reducer';
import { booksActions } from '../../reducers/books.reducer';
import { Book } from '../../shared/models/book.model';
import { BookStatus } from '../../shared/models/book-status.enum';
import { DiaryComment } from '../../shared/models/comment.model';
import { User } from '../../shared/models/user.model';
import { commentActions } from '../../reducers/comments.reducer';
import { environment } from '../../../environments/environment';
import { createOptions } from '../../shared/createOptions';
import { Http } from '@angular/http';
import { EducationModel } from '../../shared/models/education.model';
import { Shelf } from '../../shared/models/shelf.model';
import { shelvesActions } from '../../reducers/shelves.reducer';
import { trackingActions } from '../../reducers/tracking.reducer';
import { StoredReading, Interval } from '../../shared/models/tracking.model';
import * as moment from 'moment';
import 'moment/locale/cs';
import { getDurationFormat } from '../../shared/duration-format';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookDetailComponent implements OnInit, AfterViewChecked, OnDestroy {

  book: GRBook;
  bookInfo: Book;
  tether: Tether;
  selectedTab: number = 0;
  tabs: string[] = [
    'Good Reads',
    'Google Books',
    'Amazon',
    'Something'
  ];
  dispatcher: ComponentDispatcher;
  subscriptions: any[] = [];
  loading: boolean = false;
  insertLoading: boolean = false;
  id: number;
  BookStatus = BookStatus;
  comments: DiaryComment[] = [];
  userComment: DiaryComment;
  user: User;
  newComment = false;
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

  constructor(private store: Store<AppState>, private route: ActivatedRoute, private router: Router, private http: Http, private cd: ChangeDetectorRef) {
    moment.locale('cs');
    this.dispatcher = new ComponentDispatcher(store, this);
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.dispatcher.dispatch('CLEAR');
      if (this.id) {
        this.dispatcher.dispatch(detailActions.API_GET, this.id);
        this.dispatcher.dispatch(booksActions.ADDITIONAL.GET_SINGLE, this.id);
        this.dispatcher.dispatch(shelvesActions.API_GET);
        this.dispatcher.dispatch(commentActions.API_GET, this.id);
      }
    });
    // user book info
    this.subscriptions.push(foxy(store, 'books', this)
      .subscribe(
        (data: SquirrelState<Book>) => {
          if (data.error) {
            console.error(data.error);
            return;
          } else {
            if (data.data.length && !data.loading) {
              this.bookInfo = data.data[0];
              if (this.bookInfo.inBooks) {
                console.log('getting tracking');
                this.dispatcher.dispatch(trackingActions.API_GET, this.id);
              }

              if (this.updateLatest) {
                console.log('updating latest because it was closed by changing status');
                this.dispatcher.dispatch(trackingActions.ADDITIONAL.API_GET_LAST);
                this.updateLatest = false;
              }
            }
          }
          this.insertLoading = data.loading;
          this.cd.markForCheck();
        })
    );
    // book gr info
    this.subscriptions.push(foxy(store, 'detail', this)
      .subscribe(
        (data: SquirrelState<GRBook>) => {
          if (data.error) {
            console.error(data.error);
          } else {
            if (data.data.length) {
              this.book = Object.assign({}, data.data[0]);
              let div = document.createElement('div');
              div.innerHTML = this.book.description;
              this.book.description = div.textContent || div.innerText || '';
              if (data.data[0].similarBooks) {
                this.similarBooks = data.data[0].similarBooks.map(book => this.getSimilarBook(book));
              } else {
                this.similarBooks = [];
              }
              if (this.bookInfo && this.bookInfo.educational.obsah.length === 0) {
                this.bookInfo.educational.obsah = this.book.description;
                this.bookInfo = Object.assign({}, this.bookInfo);
              }
            }
          }
          this.cd.markForCheck();
        }
      )
    );

    // comments
    this.subscriptions.push(foxy(store, 'comments', this)
      .subscribe(
        (data: SquirrelState<DiaryComment>) => {
          if (data.error) {
            console.error(data.error);
          } else {
            if (this.user) {
              this.comments = data.data;
              this.userComment = this.comments.find(comment => comment.userId === this.user.id);
              if (!this.userComment) {
                this.userComment = {
                  date: 'date',
                  userName: this.user.userName,
                  text: '',
                  bookId: this.id,
                  userId: this.user.id
                };
                this.newComment = true;
              } else {
                this.newComment = false;
              }
            }
          }
          this.cd.markForCheck();
        })
    );

    // user info
    this.subscriptions.push(foxy(store, 'users', this)
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
    this.subscriptions.push(foxy(store, 'shelves', this)
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

    this.subscriptions.push(foxy(store, 'tracking', this)
      .subscribe(
        (data: SquirrelState<StoredReading>) => {
          if (data.error) {
            console.error(data.error);
          } else {
            if (data.data.length && !data.loading) {
              console.log('tracking DATA', data.data);
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
                this.dispatcher.dispatch(booksActions.ADDITIONAL.GET_SINGLE, this.id);
                this.updateDetail = false;
              }
            }
          }
          this.trackingsLoading = data.loading;
          this.cd.markForCheck();
        })
    );
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.dispatcher.dispatch('CLEAR');
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

  selectTab(index: number) {
    this.selectedTab = index;
    let offset = index * 40;
    this.tether.setOptions({
      element: '.triangle',
      target: '.tabs-container',
      attachment: 'top left',
      targetAttachment: 'top right',
      targetOffset: `${offset}px 0`
    });
  }

  addBook() {
    this.dispatcher.dispatch(booksActions.API_CREATE, this.id);
  }

  removeBook() {
    this.dispatcher.dispatch(booksActions.API_DELETE, this.id);
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
    this.dispatcher.dispatch(booksActions.API_UPDATE, this.bookInfo);
  }

  editComment(item: any) {
    this.dispatcher.dispatch(commentActions.API_UPDATE, item);
  }

  addComment(item: any) {
    this.dispatcher.dispatch(commentActions.API_CREATE, item);
  }

  deleteComment(item: any) {
    this.dispatcher.dispatch(commentActions.API_DELETE, item);
  }

  getSimilarBook(book: GRSimilarBook): Book {
    let newBook = {};
    newBook['title'] = book.title;
    newBook['author'] = book.authors[0].name;
    newBook['imageUrl'] = book.imageUrl;
    newBook['id'] = +book.id;
    return <Book>newBook;
  }

  goToBook(book: Book) {
    this.http.post(`${environment.apiUrl}/book`, book, createOptions()).subscribe(
      data => {
        this.router.navigate([`platform/detail/${data.json().id}`]);
      }
    );
  }

  setEducational(educational: EducationModel) {
    console.log('form', educational);
    this.bookInfo.educational = educational;
    this.dispatcher.dispatch(booksActions.API_UPDATE, this.bookInfo);
  }

  isInShelve(id: number): boolean {
    return this.inShelves.indexOf(id) > -1 ? true : false;
  }

  toggleShelf(id: number) {
    if (this.isInShelve(id)) {
      this.dispatcher.dispatch(shelvesActions.ADDITIONAL.API_REMOVE_BOOK, {id: id, book: this.bookInfo});
    } else {
      this.dispatcher.dispatch(shelvesActions.ADDITIONAL.API_ADD_BOOK, {id: id, book: this.bookInfo});
    }
  }

  addNewShelf(event) {
    event.stopPropagation();
    if (this.newShelf.length > 0) {
      this.dispatcher.dispatch(shelvesActions.API_CREATE, {name: this.newShelf});
    }
  }

  startTracking() {
    this.dispatcher.dispatch(trackingActions.ADDITIONAL.API_START, {id: this.id, readings: true});
    // update only if book wasnt reading
    if (this.bookInfo.status !== BookStatus.READING) {
      this.updateDetail = true;
    }
  }

  stopTracking() {
    this.dispatcher.dispatch(trackingActions.ADDITIONAL.API_END, {id: this.id, readings: true});
  }


  selectReading(index: number) {
    this.selectedReading = index;
  }

  get existThisShelf() {
    return this.shelves.filter(shelf => shelf.name === this.newShelf).length === 1;
  }

  // gets reading interval for currently selected reading
  get readingInterval() {
    if (this.trackings.readings[this.selectedReading].completed) {
      return `${moment(this.trackings.readings[this.selectedReading].start).format('LLL')}
         - ${moment(this.trackings.readings[this.selectedReading].stop).format('LLL')}`;
    } else {
      return moment(this.trackings.readings[this.selectedReading].start).format('LLL');
    }
  }

  // gets reading interval through all readings
  get wholeReadingTime() {
    let time = 0;
    for (let reading of this.trackings.readings) {
      time = time + this.getIntervalHours(reading.intervals);
    }
    return getDurationFormat(moment.duration(time));
  }


  // gets formatted time
  getTime(timestamp: string) {
    return timestamp !== '0001-01-01T00:00:00Z' ? moment(timestamp).format('LLL') : '-';
  }

  // gets interval duration
  getDuration(start: string, stop: string) {
    if (stop === '0001-01-01T00:00:00Z') {
      return '-';
    }
    let duration = moment.duration(moment(stop).diff(moment(start)));
    return getDurationFormat(duration);
  }

  // gets time of reading intervals
  getIntervalHours(intervals: Interval[]): number {
    let time = 0;
    for (let interval of intervals) {
      if (interval.stop !== '0001-01-01T00:00:00Z') {
        time = time + moment(interval.stop).diff(interval.start);
      }
    }
    return time;
  }

  get readingTime() {
    let duration = moment
      .duration(this.getIntervalHours(this.trackings.readings[this.selectedReading].intervals));
    return getDurationFormat(moment.duration(this.getIntervalHours(this.trackings.readings[this.selectedReading].intervals)));
  }

}
