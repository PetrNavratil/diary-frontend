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
  @Output() accept: EventEmitter<FriendRequest> = new EventEmitter<FriendRequest>();
  @Output() decline: EventEmitter<FriendRequest> = new EventEmitter<FriendRequest>();

  acceptRequest(request: FriendRequest): void{
    this.accept.emit(request);
  }

  declineRequest(request: FriendRequest){
    this.decline.emit(request);
  }

  avatar(url: string): string{
    return getImageUrl(url);
  }


}
