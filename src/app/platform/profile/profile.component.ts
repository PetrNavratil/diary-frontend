import { Component, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AppState } from '../../models/store-model';
import { Store } from '@ngrx/store';
import {} from '@flowup/squirrel';
import { User } from '../../models/user.model';
import { userActions } from '../../reducers/user.reducer';
import { SquirrelState } from '@flowup/squirrel';
import { getImageUrl } from '../../shared/getImageUrl';
import { FriendRequest } from '../../models/friendRequest.model';
import { Friend } from '../../models/friend.model';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { animate, style, state, trigger, transition } from '@angular/animations';
import { peopleActions } from '../../reducers/people.reducer';
import { requestActions } from '../../reducers/friend-request.reducer';
import { friendsActions } from '../../reducers/friends.reducer';
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
  /**
   * Logged user data
   * @type{User}
   */
  user: User;
  /**
   * Store subscriptions
   * @type {Subscription[]}
   */
  subscriptions: Subscription[] = [];
  /**
   * Data loading
   * @type {boolean}
   */
  loading: boolean = false;
  /**
   * Subject for input change event
   * @type {Subject<string>}
   */
  userInputChange: Subject<string> = new Subject<string>();
  /**
   * State of search content
   * @type {string}
   */
  state: string = COLLAPSED;
  /**
   * Incoming requests
   * @type {FriendRequest[]}
   */
  incomingFriendRequests: FriendRequest[] = [];
  /**
   * Outgoing requests
   * @type {FriendRequest[]}
   */
  outgoingFriendRequests: FriendRequest[] = [];
  /**
   * Search loading
   * @type {boolean}
   */
  searcherLoading = false;
  /**
   * Searches people
   * @type {User[]}
   */
  people: User[] = [];
  /**
   * User's friends
   * @type {Friend[]}
   */
  friends: Friend[] = [];
  /**
   * States whether nothing component should be visible
   * @type {boolean}
   */
  showNothing = false;
  /**
   * Holds photo input element
   * @type {ElementRef}
   */
  @ViewChild('photoInput') inputElement: ElementRef;
  /**
   * Holds dropdown content element
   * @type {ElementRef}
   */
  @ViewChild('dropdown') dropdownElement: ElementRef;

  constructor(private store: Store<AppState>, private router: Router, private auth: AuthService) {
    // get friends
    this.store.dispatch({type: friendsActions.API_GET});

    // subscribe to the store for users
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

    // subscribe to the store for requests
    this.subscriptions.push(this.store.select('requests').subscribe(
      (data: SquirrelState<FriendRequest>) => {
        if (!data.loading) {
          // filter data
          this.incomingFriendRequests = data.data.filter(request => request.requesterId !== this.user.id);
          this.outgoingFriendRequests = data.data.filter(request => request.requesterId === this.user.id);
        }
      }
    ));

    // subscribe to the friends
    this.subscriptions.push(this.store.select('friends').subscribe(
      (data: SquirrelState<Friend>) => {
        if (!data.loading) {
          this.friends = data.data;
        }
      }
    ));

    // subscribe to the searched people
    this.subscriptions.push(this.store.select('people').subscribe(
      (data: SquirrelState<User>) => {
        if (!data.loading) {
          this.people = data.data;
          this.searcherLoading = false;
        }
      }
    ));

    // subscribe to the input change and emit action after .5s if changed
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

  /**
   * Dispatches action after confirm changes button has been clicked
   * @param event
   */
  editUser(event): void {
    event.stopPropagation();
    this.store.dispatch({type: userActions.API_UPDATE, payload: this.user});
  }

  /**
   * Opens file dialogue after click on avatar
   */
  openFile() :void {
    this.inputElement.nativeElement.click();
  }

  /**
   * Dispatches action after avatar has been selected
   */
  uploadFile(): void {
    if (this.inputElement.nativeElement.files.length > 0) {
      this.store.dispatch({type: userActions.ADDITIONAL.UPLOAD_AVATAR, payload: this.inputElement.nativeElement.files[0]});
    }
  }

  /**
   * Gets avatar url
   * @returns {string}
   */
  get avatarUrl(): string {
    return getImageUrl(this.user.avatar);
  }

  /**
   * Redirect to the friend detail profile
   * @param id
   */
  goToDetail(id: number):void{
    this.router.navigateByUrl(`platform/friend/${id}`);
  }

  /**
   * Shows dropdown content
   */
  showDropdown(): void
  {
    this.state = EXPANDED;
  }

  /**
   * Called after search input is changed
   * @param value
   */
  changed(value: string): void{
    this.searcherLoading = true;
    // If user has typed anything to the search window pass its value to the subject
    this.userInputChange.next(value);
  }

  /**
   * Gets avatar url
   * @param url
   * @returns {string}
   */
  avatar(url: string):string{
    return getImageUrl(url);
  }

  /**
   * Emits action after send request button has been clicked
   * @param id
   */
  sendRequest(id: number):void{
    this.store.dispatch({type: requestActions.API_CREATE, payload: id});
  }

  /**
   * Emits action after decline request button has been clicked
   * @param id
   */
  declineRequest(id: number):void{
    this.store.dispatch({type: requestActions.ADDITIONAL.DECLINE, payload:id});
  }

  /**
   * Emits action after accept request button has been clicked
   * @param id
   */
  acceptRequest(id: number):void{
    this.store.dispatch({type: requestActions.ADDITIONAL.ACCEPT, payload:id})
  }

  /**
   * Emits action after remove request button has been clicked
   * @param id
   */
  removeRequest(id: number):void{
    this.store.dispatch({type: requestActions.API_DELETE, payload:id})
  }

  /**
   * Emits action after remove request button in searcher has been clicked
   * @param userId
   */
  removeRequestFromSearcher(userId: number):void{
    this.removeRequest(this.outgoingFriendRequests.filter(request => request.userId === userId)[0].id);
  }

  /**
   * Emits action after decline request button in searcher has been clicked
   * @param requesterId
   */
  declineRequestFromSearcher(requesterId: number):void{
    this.declineRequest(this.incomingFriendRequests.filter(request => request.requesterId === requesterId)[0].id);
  }

  /**
   * Emits action after accept request button in searcher has been clicked
   * @param requesterId
   */
  acceptRequestFromSearcher(requesterId: number):void{
    this.acceptRequest(this.incomingFriendRequests.filter(request => request.requesterId === requesterId)[0].id);
  }


  /**
   * Emits action after remove friend button has been clicked
   * @param id
   */
  removeFriend(id: number):void{
    this.store.dispatch({type: friendsActions.API_DELETE, payload: id});
  }


  /**
   * Finds out whether remove request button should be visible
   * @param userId
   * @returns {boolean}
   */
  shouldRemoveRequest(userId: number):boolean{
    return this.outgoingFriendRequests.findIndex(request => request.userId === userId) > -1;
  }

  /**
   * Finds out whether remove friend button should be visible
   * @param userId
   * @returns {boolean}
   */
  shouldRemoveFromFriends(userId: number):boolean{
    return this.friends.findIndex(friend => friend.id === userId) > -1;
  }

  /**
   * Finds out whether decline or accept request button should be visible
   * @param userId
   * @returns {boolean}
   */
  shouldDeclineOrAccept(userId: number):boolean{
    return this.incomingFriendRequests.findIndex(request => request.requesterId === userId) > -1  ;
  }

  /**
   * Finds out whether send request button should be visible
   * @param userId
   * @returns {boolean}
   */
  shouldAddRequest(userId: number):boolean{
    return !this.shouldRemoveRequest(userId) && !this.shouldDeclineOrAccept(userId) && !this.shouldRemoveFromFriends(userId);
  }

  /**
   * Changes password of user
   */
  changePassword():void{
    this.auth.changePassword(this.user.email);
  }


  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  ngAfterViewInit(){
    document.body.addEventListener('click', (event) => {
      if (!this.dropdownElement.nativeElement.contains(event.target)) {
        this.state = COLLAPSED;
      }
    });
  }
}
