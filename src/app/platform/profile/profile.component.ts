import { Component, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AppState } from '../../shared/models/store-model';
import { Store } from '@ngrx/store';
import {} from '@flowup/squirrel';
import { User } from '../../shared/models/user.model';
import { userActions } from '../../reducers/user.reducer';
import { SquirrelState } from '@flowup/squirrel';
import { getImageUrl } from '../../shared/getImageUrl';
import { FriendRequest } from '../../shared/models/friendRequest.model';
import { Friend } from '../../shared/models/friend.model';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { animate, style, state, trigger, transition } from '@angular/animations';
import { peopleActions } from '../../reducers/people.reducer';
import { requestActions } from '../../reducers/friend-request.reducer';
import { friendsReducer, friendsActions } from '../../reducers/friends.reducer';
import { AuthService } from '../../shared/auth.service';

const COLLAPSED = 'collapsed';
const EXPANDED = 'expanded';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [
    trigger('expandable', [
      state(COLLAPSED, style({'height': '0', 'opacity': '0', 'width': '0'})),
      state(EXPANDED, style({'height': '*', 'opacity': '1', 'width': '100%'})),
      transition('* => *', animate('500ms ease-out'))
    ])
  ],
})
export class ProfileComponent implements OnDestroy, AfterViewInit {
  user: User;
  subscriptions: any[] = [];
  loading: boolean = false;
  @ViewChild('photoInput') inputElement: ElementRef;
  @ViewChild('dropdown') dropdownElement: ElementRef;
  userInputChange: Subject<string> = new Subject<string>();
  state: string = COLLAPSED;
  incomingFriendRequests: FriendRequest[] = [];
  outgoingFriendRequests: FriendRequest[] = [];
  searcherLoading = false;
  people: User[] = [];
  friends: Friend[] = [];
  showNothing = false;

  constructor(private store: Store<AppState>, private router: Router, private auth: AuthService) {

    this.store.dispatch({type: friendsActions.API_GET});

    this.subscriptions.push(
      this.store.select('users').subscribe(
        (data: SquirrelState<User>) => {
          this.loading = data.loading;
          if (!data.loading && data.data.length) {
            this.user = Object.assign({}, data.data[0]);
          }
        }
      )
    );

    this.subscriptions.push(this.store.select('requests').subscribe(
      (data: SquirrelState<FriendRequest>) => {
        if (!data.loading) {
          this.incomingFriendRequests = data.data.filter(request => request.requesterId !== this.user.id);
          this.outgoingFriendRequests = data.data.filter(request => request.requesterId === this.user.id);
        }
      }
    ));

    this.subscriptions.push(this.store.select('friends').subscribe(
      (data: SquirrelState<Friend>) => {
        if (!data.loading) {
          this.friends = data.data;
        }
      }
    ));

    this.subscriptions.push(this.store.select('people').subscribe(
      (data: SquirrelState<User>) => {
        if (!data.loading) {
          // this.state = data.data.length ? EXPANDED : COLLAPSED;
          this.people = data.data;
          console.log('people', this.people);
          this.searcherLoading = false;
        }
      }
    ));

    this.subscriptions.push(this.userInputChange
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(value => {
        if (value === '') {
          this.searcherLoading = false;
        } else {
          this.showNothing = true;
          this.store.dispatch({type: peopleActions.API_GET, payload: value});
        }
      }));

  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  editUser(event) {
    event.stopPropagation();
    this.store.dispatch({type: userActions.API_UPDATE, payload: this.user});
  }

  openFile() {
    this.inputElement.nativeElement.click();
  }

  uploadFile() {
    console.info(this.inputElement.nativeElement.files);
    if (this.inputElement.nativeElement.files.length > 0) {
      this.store.dispatch({type: userActions.ADDITIONAL.UPLOAD_AVATAR, payload: this.inputElement.nativeElement.files[0]});
    }
  }

  get avatarUrl() {
    return getImageUrl(this.user.avatar);
  }

  goToDetail(id: number){
    this.router.navigateByUrl(`platform/friend/${id}`);
  }

  showDropdown() {
    this.state = EXPANDED;
  }

  changed(value: string){
    this.searcherLoading = true;
    this.userInputChange.next(value);
  }

  avatar(url: string):string{
    return getImageUrl(url);
  }

  ngAfterViewInit(){
    document.body.addEventListener('click', (event) => {
      if (!this.dropdownElement.nativeElement.contains(event.target)) {
        this.state = COLLAPSED;
      }
    });
  }

  sendRequest(id: number){
    this.store.dispatch({type: requestActions.API_CREATE, payload: id});
  }

  declineRequest(id: number){
    this.store.dispatch({type: requestActions.ADDITIONAL.DECLINE, payload:id});
  }

  acceptRequest(id: number){
    this.store.dispatch({type: requestActions.ADDITIONAL.ACCEPT, payload:id})
  }

  removeRequest(id: number){
    this.store.dispatch({type: requestActions.API_DELETE, payload:id})
  }

  removeRequestFromSearcher(userId: number){
    this.removeRequest(this.outgoingFriendRequests.filter(request => request.userId === userId)[0].id);
  }

  declineRequestFromSearcher(requesterId: number){
    this.declineRequest(this.incomingFriendRequests.filter(request => request.requesterId === requesterId)[0].id);
  }

  acceptRequestFromSearcher(requesterId: number){
    this.acceptRequest(this.incomingFriendRequests.filter(request => request.requesterId === requesterId)[0].id);
  }


  removeFriend(id: number){
    this.store.dispatch({type: friendsActions.API_DELETE, payload: id});
  }


  shouldRemoveRequest(userId: number){
    return this.outgoingFriendRequests.findIndex(request => request.userId === userId) > -1;
  }

  shouldRemoveFromFriends(userId: number){
    return this.friends.findIndex(friend => friend.id === userId) > -1;
  }

  shouldDeclineOrAccept(userId: number){
    return this.incomingFriendRequests.findIndex(request => request.requesterId === userId) > -1  ;
  }

  shouldAddRequest(userId: number){
    return !this.shouldRemoveRequest(userId) && !this.shouldDeclineOrAccept(userId) && !this.shouldRemoveFromFriends(userId);
  }

  changePassword(){
    this.auth.changePassword(this.user.email);
  }

}
