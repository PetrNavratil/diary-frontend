import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

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
import { AuthEffect } from './effects/auth.effect';
import { authReducer } from './reducers/auth.reducer';
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

    AppRoutes,

    StoreModule.provideStore({
      search: searchReducer,
      detail: detailReducer,
      auth: authReducer,
      books: booksReducer,
      comments: commentReducer,
      shelves: shelvesReducer,
      tracking: trackingReducer,
      users: usersReducer
    }),
    EffectsModule.runAfterBootstrap(SearchEffect),
    EffectsModule.runAfterBootstrap(BookDetail),
    EffectsModule.runAfterBootstrap(AuthEffect),
    EffectsModule.runAfterBootstrap(BookEffect),
    EffectsModule.runAfterBootstrap(CommentsEffect),
    EffectsModule.runAfterBootstrap(ShelvesEffect),
    EffectsModule.runAfterBootstrap(TrackingEffect),
    EffectsModule.runAfterBootstrap(UserEffect),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

