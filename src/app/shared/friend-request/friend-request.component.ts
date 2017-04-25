import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FriendRequest } from '../models/friendRequest.model';
import { getImageUrl } from '../getImageUrl';

@Component({
  selector: 'app-friend-request',
  templateUrl: './friend-request.component.html',
  styleUrls: ['./friend-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class FriendRequestComponent{

  @Input() requests: FriendRequest[] = [];
  @Output() accept: EventEmitter<number> = new EventEmitter<number>();
  @Output() decline: EventEmitter<number> = new EventEmitter<number>();

  acceptRequest(request: FriendRequest): void{
    this.accept.emit(request.id);
  }

  declineRequest(request: FriendRequest){
    this.decline.emit(request.id);
  }

  avatar(url: string): string{
    return getImageUrl(url);
  }


}
