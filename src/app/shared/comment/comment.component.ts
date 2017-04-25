import {
  Component, Input, Output, EventEmitter, ViewChild, ElementRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { DiaryComment } from '../models/comment.model';
import { getImageUrl } from '../getImageUrl';
import * as moment from 'moment';
import 'moment/locale/cs';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentComponent{

  @Input() editable = false;
  @Input() commentData: DiaryComment;
  @Output() editComment = new EventEmitter<DiaryComment>();
  @Output() addComment = new EventEmitter<DiaryComment>();
  @Output() deleteComment = new EventEmitter<DiaryComment>();
  @ViewChild('commentEdit') comment: ElementRef;
  @Input() loading = false;
  commentPlaceholder = 'Přidejte Váš komentář ke knize...';
  focused = false;

  constructor(){
    moment.locale('cs');
  }

  edit() {
    let text = this.comment.nativeElement.textContent.trim();
    if (text.length > 0 && text !== this.commentPlaceholder) {
      this.editComment.emit(Object.assign({}, this.commentData, {text: text}));
    }
  }

  add() {
    let text = this.comment.nativeElement.textContent.trim();
    if (text.length > 0 && text !== this.commentPlaceholder) {
      this.addComment.emit(Object.assign({}, this.commentData, {text: text}));
    }
  }

  remove() {
    this.deleteComment.emit(this.commentData);
  }

  removePlaceholder() {
    this.focused = true;
    if (this.comment.nativeElement.textContent.trim() === this.commentPlaceholder) {
      this.comment.nativeElement.textContent = '';
    }
  }

  setPlaceholder() {
    this.focused = false;
    if (this.comment.nativeElement.textContent.trim().length === 0) {
      this.comment.nativeElement.textContent = this.commentPlaceholder;
    }
  }

  get avatarUrl() {
    return getImageUrl(this.commentData.userAvatar);
  }

  get time(){
    return this.commentData.date.length > 0 ? moment(this.commentData.date).format('LLL') : '';
  }

  setEditable(){
    if(this.editable){
      this.comment.nativeElement.setAttribute("contentEditable", true);
      this.comment.nativeElement.focus();
    }
  }

  /**
   * Clears pasted values to the editable div to assure div default style setting
   * @param event
   */
  pasteToInput(event: ClipboardEvent): void {
    const text = event.clipboardData.getData('text/plain').trim();
    document.execCommand('insertText', false, text);
    event.preventDefault();
  }
}
