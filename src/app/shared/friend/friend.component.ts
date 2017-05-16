import { Component, Input, Output, EventEmitter } from '@angular/core';
import { getImageUrl } from '../getImageUrl';
import { Friend } from '../../models/friend.model';
import * as moment from 'moment';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss']
})
export class FriendComponent {
  /**
   * User's friends
   * @type {Friend[]}
   */
  @Input() friends: Friend[] = [];
  /**
   * States whether element is clickable
   * @type {boolean}
   */
  @Input() clickable = true;
  /**
   * Remove friend emitter
   * @type {EventEmitter<number>}
   */
  @Output() removeFriend: EventEmitter<number> = new EventEmitter<number>();
  /**
   * Go to friend detail emitter
   * @type {EventEmitter<number>}
   */
  @Output() goToDetail: EventEmitter<number> = new EventEmitter<number>();

  /**
   * Return image url
   * @param url
   * @returns {string}
   */
  avatar(url: string): string {
    return getImageUrl(url);
  }

  /**
   * Emits event after remove friend button has been clicked
   * @param friend
   * @param event
   */
  remove(friend: Friend, event): void {
    event.stopPropagation();
    this.removeFriend.emit(friend.id);
  }

  /**
   * Emits event after friend item has been clicked
   * @param friend
   */
  detail(friend: Friend) {
    if (this.clickable) {
      this.goToDetail.emit(friend.id);
    }
  }

  /**
   * Returns formated date based on locale
   * @param date
   * @returns {string}
   */
  getDate(date: string): string {
    return moment(date).format('LLL');
  }


}
