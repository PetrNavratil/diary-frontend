import { GRSearchBook } from './goodreadsBook.model';
import { BookInfo, Book } from './book.model';
import { SquirrelState } from '@flowup/squirrel';
import { User } from './user.model';
import { Comment } from '@angular/compiler';
import { Shelf } from './shelf.model';
import { Reading, StoredReading } from './tracking.model';
import { Statistic } from './statistic.model';
import { StatisticInterval } from './statistic-interval.model';
import { FriendRequest } from './friendRequest.model';
import { Friend } from './friend.model';

export interface AppState {
  search: SquirrelState<GRSearchBook>;
  bookDetail: SquirrelState<BookInfo>;
  books: SquirrelState<Book>;
  comments: SquirrelState<Comment>;
  shelves: SquirrelState<Shelf>;
  tracking: SquirrelState<StoredReading>;
  users: SquirrelState<User>;
  readings: SquirrelState<Reading>;
  statistics: SquirrelState<Statistic>;
  intervals: SquirrelState<StatisticInterval>;
  latestBooks: SquirrelState<Book>;
  requests: SquirrelState<FriendRequest>;
  people: SquirrelState<User>;
  friends: SquirrelState<Friend>;
}