import { Component, Input, Output, EventEmitter } from '@angular/core';
import { getImageUrl } from '../getImageUrl';
import { Friend } from '../../models/friend.model';
import * as moment from 'moment';
import 'moment/locale/cs';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss']
})
export class FriendComponent {
  @Input() friends: Friend[] = [];
  @Input() clickable = true;
  @Output() removeFriend: EventEmitter<number> = new EventEmitter<number>();
  @Output() goToDetail: EventEmitter<number> = new EventEmitter<number>();

  constructor(){
    moment.locale('cs');
}

  avatar(url: string):string{
    return getImageUrl(url);
  }

  remove(friend: Friend, event){
    event.stopPropagation();
    this.removeFriend.emit(friend.id);
  }

  detail(friend: Friend){
    if(this.clickable){
      this.goToDetail.emit(friend.id);
    }
  }

  getDate(date: string){
    return moment(date).format('LLL');
  }


}
