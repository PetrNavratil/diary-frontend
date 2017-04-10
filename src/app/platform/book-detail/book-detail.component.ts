import { Component, AfterViewChecked, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '../../shared/models/store-model';
import { Store } from '@ngrx/store';
import { GRBook, GRSimilarBook } from '../../shared/models/goodreadsBook.model';
import * as Tether from 'tether';
import { ComponentDispatcher, squirrel, SquirrelData } from '@flowup/squirrel';
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

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
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

  constructor(private store: Store<AppState>, private route: ActivatedRoute, private router: Router, private http: Http) {
    moment.locale('cs');
    this.dispatcher = new ComponentDispatcher(store, this);
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      if (this.id) {
        this.dispatcher.dispatch(detailActions.API_GET, this.id);
        this.dispatcher.dispatch(booksActions.ADDITIONAL.GET_SINGLE, this.id);
        this.dispatcher.dispatch(shelvesActions.API_GET);
        this.dispatcher.dispatch(commentActions.API_GET, this.id);
      }
    });
    let {dataStream: booksData, errorStream: booksError} = squirrel(store, 'books', this);
    let {dataStream: detailData, errorStream: detailError} = squirrel(store, 'detail', this);
    let {dataStream: commentsData, errorStream: commentsError} = squirrel(store, 'comments', this);
    let {dataStream: userData, errorStream: userError} = squirrel(store, 'users', this);
    let {dataStream: shelvesData, errorStream: shelvesError} = squirrel(store, 'shelves', this);
    let {dataStream: trackingData, errorStream: trackingError} = squirrel(store, 'tracking', this);
    this.subscriptions.push(
      detailData.subscribe(
        (data: SquirrelData<GRBook>) => {
          if (!data.data.length) {
            return;
          }
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
      )
    );
    this.subscriptions.push(
      detailError.subscribe(
        (error: Error) => {
          console.error(error);
          this.loading = false;
        }
      )
    );

    this.subscriptions.push(
      booksData.subscribe(
        (data: SquirrelData<Book>) => {
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
          this.insertLoading = data.loading;
        })
    );
    this.subscriptions.push(
      booksError.subscribe(
        (error: Error) => {
          console.error(error);
          this.insertLoading = false;
        }
      )
    );

    this.subscriptions.push(
      commentsData.subscribe(
        (data: SquirrelData<DiaryComment>) => {
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
        })
    );
    this.subscriptions.push(
      commentsError.subscribe(
        (error: Error) => {
          console.error(error);
        }
      )
    );

    this.subscriptions.push(
      userData.subscribe(
        (data: SquirrelData<User>) => {
          if (data.data.length) {
            this.user = data.data[0];
          }
        })
    );

    this.subscriptions.push(
      shelvesError.subscribe(
        (error: Error) => {
          console.error(error);
        }
      )
    );

    this.subscriptions.push(
      shelvesData.subscribe(
        (data: SquirrelData<Shelf>) => {
          this.newShelf = '';
          this.shelves = data.data;
          this.inShelves = this.shelves.filter(shelve => shelve.books.some(book => book.id === this.id)).map(shelve => shelve.id);
        })
    );

    this.subscriptions.push(
      trackingError.subscribe(
        (error: Error) => {
          console.error(error);
        }
      )
    );

    this.subscriptions.push(
      trackingData.subscribe(
        (data: SquirrelData<StoredReading>) => {
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
        })
    );
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
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

  addNewShelf() {
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

  get readingInterval() {
    if (this.trackings.readings[this.selectedReading].completed) {
      return `${moment(this.trackings.readings[this.selectedReading].start).format('LLL')}
         - ${moment(this.trackings.readings[this.selectedReading].stop).format('LLL')}`;
    } else {
      return moment(this.trackings.readings[this.selectedReading].start).format('LLL');
    }
  }

  get wholeReadingTime() {
    let time = 0;
    for (let reading of this.trackings.readings) {
      time = time + this.getIntervalHours(reading.intervals);
    }
    return moment.utc(moment.duration(time).asMilliseconds()).format("HH:mm");
  }

  selectReading(index: number) {
    this.selectedReading = index;
  }

  getTime(timestamp: string) {
    return timestamp !== '0001-01-01T00:00:00Z' ? moment(timestamp).format('LLL') : '-';
  }

  getDuration(start: string, stop: string) {
    if (stop === '0001-01-01T00:00:00Z') {
      return '-';
    }
    let duration = moment.duration(moment(stop).diff(moment(start)));
    return this.getDurationFormat(duration);
  }

  getIntervalHours(intervals: Interval[]) {
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
    return this.getDurationFormat(moment.duration(this.getIntervalHours(this.trackings.readings[this.selectedReading].intervals)));
  }

  getDurationFormat(time: moment.Duration) {
    let formatted: string = '';
    if (time.years()) {
      switch (time.years()) {
        case 1:
          formatted = '1 rok ';
          break;
        case 2:
        case 3:
        case 4:
          formatted = `${time.years()} roky `;
          break;
        default:
          formatted = `${time.years()} let `;
      }
    }
    if (time.months()) {
      switch (time.months()) {
        case 1:
          formatted += '1 měsíc ';
          break;
        case 2:
        case 3:
        case 4:
          formatted += `${time.months()} měsíce `;
          break;
        default:
          formatted += `${time.months()} měsíců `;
      }
    }
    if (time.weeks()) {
      switch (time.weeks()) {
        case 1:
          formatted += '1 týden ';
          break;
        case 2:
        case 3:
        case 4:
          formatted += `${time.weeks()} týdny `;
          break;
        default:
          formatted += `${time.weeks()} měsíců `;
      }
    }
    if (time.days()) {
      switch (time.days()) {
        case 1:
          formatted += '1 den ';
          break;
        case 2:
        case 3:
        case 4:
          formatted += `${time.days()} dny `;
          break;
        default:
          formatted += `${time.days()} dnů `;
      }
    }
    if (time.hours()) {
      switch (time.hours()) {
        case 1:
          formatted += '1 hodina ';
          break;
        case 2:
        case 3:
        case 4:
          formatted += `${time.hours()} hodiny `;
          break;
        default:
          formatted += `${time.hours()} hodin `;
      }
    }
    if (time.minutes()) {
      switch (time.minutes()) {
        case 1:
          formatted += '1 minuta ';
          break;
        case 2:
        case 3:
        case 4:
          formatted += `${time.minutes()} minuty `;
          break;
        default:
          formatted += `${time.minutes()} minut `;
      }
    }
    if (time.seconds()) {
      switch (time.seconds()) {
        case 1:
          formatted += '1 sekunda ';
          break;
        case 2:
        case 3:
        case 4:
          formatted += `${time.seconds()} sekundy `;
          break;
        default:
          formatted += `${time.seconds()} sekund `;
      }
    }
    return formatted;
  }
}
