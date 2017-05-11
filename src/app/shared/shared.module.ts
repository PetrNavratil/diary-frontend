import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CardComponent } from './card/card.component';
import { MaterialModule } from '@angular/material';
import { EqualValidator } from './directives/formFieldEqual';
import { LoadingButtonComponent } from './loading-button/loading-button.component';
import { BookStatusPipe } from './status.pipe';
import { DropdownRowComponent } from './dropdown-row/dropdown-row.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { TruncatePipe } from './truncate.pipe';
import { NothingComponent } from './nothing/nothing.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PdfService } from './pdf.service';
import { ToastrService } from './toastr.service';
import { AuthService } from './auth.service';
import { FriendRequestComponent } from './friend-request/friend-request.component';
import { FriendComponent } from './friend/friend.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    MaterialModule,
    BrowserAnimationsModule
  ],
  declarations: [
    CardComponent,
    EqualValidator,
    LoadingButtonComponent,
    BookStatusPipe,
    DropdownRowComponent,
    DropdownComponent,
    TruncatePipe,
    NothingComponent,
    FriendRequestComponent,
    FriendComponent
  ],
  exports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    MaterialModule,
    BrowserAnimationsModule,

    CardComponent,
    EqualValidator,
    LoadingButtonComponent,
    BookStatusPipe,
    DropdownRowComponent,
    DropdownComponent,
    TruncatePipe,
    NothingComponent,
    FriendRequestComponent,
    FriendComponent
  ],
  providers: [
    PdfService,
    ToastrService,
    AuthService
  ]
})
export class SharedModule {
}
