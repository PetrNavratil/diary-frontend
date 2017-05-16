import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FriendRequest } from '../../models/friendRequest.model';
import { getImageUrl } from '../getImageUrl';

@Component({
  selector: 'app-friend-request',
  templateUrl: './friend-request.component.html',
  styleUrls: ['./friend-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class FriendRequestComponent {

  /**
   * User's friend requests
   * @type {FriendRequest[]}
   */
  @Input() requests: FriendRequest[] = [];
  /**
   * States whether component displays incoming or outgoing requests
   * @type {boolean}
   */
  @Input() outgoing: boolean = false;
  /**
   * Accept request emitter
   * @type {EventEmitter<number>}
   */
  @Output() accept: EventEmitter<number> = new EventEmitter<number>();
  /**
   * Decline request emitter
   * @type {EventEmitter<number>}
   */
  @Output() decline: EventEmitter<number> = new EventEmitter<number>();
  /**
   * Remove request event emitter
   * @type {EventEmitter<number>}
   */
  @Output() remove: EventEmitter<number> = new EventEmitter<number>();

  /**
   * Emits event after accept request button has been clicked
   * @param request
   */
  acceptRequest(request: FriendRequest): void {
    this.accept.emit(request.id);
  }

  /**
   * Emits event after decline request button has been clicked
   * @param request
   */
  declineRequest(request: FriendRequest): void {
    this.decline.emit(request.id);
  }

  /**
   * Emits event after remove request button has been clicked
   * @param request
   */
  removeRequest(request: FriendRequest): void {
    this.remove.emit(request.id);
  }

  /**
   * Returns avatar url
   * @param url
   * @returns {string}
   */
  avatar(url: string): string {
    return getImageUrl(url);
  }


}
