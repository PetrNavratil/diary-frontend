import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';

import { AppComponent } from './app.component';
import { LandingModule } from './landing/landing.module';
import { AppRoutes } from './app.routes';
import { PlatformModule } from './platform/platform.module';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import 'hammerjs';
import { searchReducer } from './reducers/search.reducer';
import { SearchEffect } from './effects/search.effect';
import { detailReducer } from './reducers/book-detail.reducer';
import { BookDetail } from './effects/book-detail.effect';
import { booksReducer } from './reducers/books.reducer';
import { BookEffect } from './effects/books.effect';
import { commentReducer } from './reducers/comments.reducer';
import { CommentsEffect } from './effects/comment.effects';
import { shelvesReducer } from './reducers/shelves.reducer';
import { ShelvesEffect } from './effects/shelves.effect';
import { trackingReducer } from './reducers/tracking.reducer';
import { TrackingEffect } from './effects/tracking.effect';
import { usersReducer } from './reducers/user.reducer';
import { UserEffect } from './effects/user.effect';
import { readingReducer } from './reducers/reading.reducer';
import { ReadingEffect } from './effects/readings.effect';
import { statisticReducer } from './reducers/statistic.reducer';
import { StatisticEffect } from './effects/statistic.effect';
import { intervalsReducer } from './reducers/statistic-intervals.reducer';
import { IntervalsEffect } from './effects/statistic-intervals.effect';
import { latestBooksReducer } from './reducers/latestBooks.reducer';
import { LatestBooksEffect } from './effects/latestBooks.effect';
import { ToastModule, ToastOptions } from 'ng2-toastr';
import { RequestEffect } from './effects/friend-request.effect';
import { requestReducer } from './reducers/friend-request.reducer';
import { PeopleEffect } from './effects/people.effect';
import { peopleReducer } from './reducers/people.reducer';
import { friendsReducer } from './reducers/friends.reducer';
import { FriendsEffect } from './effects/friends.effect';
import { TranslateModule, TranslateStaticLoader, TranslateLoader } from 'ng2-translate';

export class CustomOption extends ToastOptions {
  animate = 'flyRight';
  newestOnTop = true;
  toastLife = 3000;
  positionClass = 'toast-bottom-right';
}

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/languages', '.json');
}


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    LandingModule,
    PlatformModule,
    ToastModule.forRoot(),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }),

    AppRoutes,

    StoreModule.provideStore({
      search: searchReducer,
      detail: detailReducer,
      books: booksReducer,
      comments: commentReducer,
      shelves: shelvesReducer,
      tracking: trackingReducer,
      users: usersReducer,
      readings: readingReducer,
      statistics: statisticReducer,
      intervals: intervalsReducer,
      latestBooks: latestBooksReducer,
      requests: requestReducer,
      people: peopleReducer,
      friends: friendsReducer
    }),
    EffectsModule.runAfterBootstrap(SearchEffect),
    EffectsModule.runAfterBootstrap(BookDetail),
    EffectsModule.runAfterBootstrap(BookEffect),
    EffectsModule.runAfterBootstrap(CommentsEffect),
    EffectsModule.runAfterBootstrap(ShelvesEffect),
    EffectsModule.runAfterBootstrap(TrackingEffect),
    EffectsModule.runAfterBootstrap(UserEffect),
    EffectsModule.runAfterBootstrap(ReadingEffect),
    EffectsModule.runAfterBootstrap(StatisticEffect),
    EffectsModule.runAfterBootstrap(IntervalsEffect),
    EffectsModule.runAfterBootstrap(LatestBooksEffect),
    EffectsModule.runAfterBootstrap(RequestEffect),
    EffectsModule.runAfterBootstrap(PeopleEffect),
    EffectsModule.runAfterBootstrap(FriendsEffect),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),


  ],
  providers: [
    {provide: ToastOptions, useClass: CustomOption}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

