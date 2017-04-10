import {
  Component, Input, trigger, state, style, transition, animate, Output, EventEmitter, ViewChild, ElementRef,
  ChangeDetectionStrategy, OnChanges
} from '@angular/core';
import { DiaryComment } from '../models/comment.model';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  animations: [
    trigger('display', [
      state('inactive', style({
        opacity: '0'
      })),
      state('active', style({
        opacity: '1'
      })),
      transition('inactive => active', animate('500ms ease-in')),
      transition('active => inactive', animate('500ms ease-out'))
    ]),
    trigger('edit', [
      state('inactive', style({
        opacity: '0'
      })),
      state('active', style({
        opacity: '1'
      })),
      transition('inactive => active', animate('500ms ease-in')),
      transition('active => inactive', animate('500ms ease-out'))
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentComponent implements OnChanges {

  @Input() newComment = false;
  @Input() editable = false;
  @Input() commentData: DiaryComment;
  @Output() editComment = new EventEmitter<DiaryComment>();
  @Output() addComment = new EventEmitter<DiaryComment>();
  @Output() deleteComment = new EventEmitter<DiaryComment>();
  @ViewChild('commentEdit') comment: ElementRef;
  commentPlaceholder = 'Add text by typing here...';

  displayState = 'active';
  editState = 'inactive';
  displayed = 'display';

  switchMode() {
    if (!this.editable) {
      return;
    }
    if (this.displayed === 'display') {
      this.displayState = this.displayState === 'inactive' ? 'active' : 'inactive';
    } else {
      this.editState = this.editState === 'inactive' ? 'active' : 'inactive';
    }
  }

  swapState(location: string) {
    if (!this.editable) {
      return;
    }
    if (location === 'display' && this.displayState === 'inactive' && this.displayed === 'display') {
      this.displayed = 'edit';
      this.switchMode();
    } else if (location === 'edit' && this.editState === 'inactive' && this.displayed === 'edit') {
      this.displayed = 'display';
      this.switchMode();
    }
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
    if (this.comment.nativeElement.textContent.trim() === this.commentPlaceholder) {
      this.comment.nativeElement.textContent = '';
    }
    console.log('focus');
  }

  setPlaceholder() {
    console.log('blur');
    if (this.comment.nativeElement.textContent.trim().length === 0) {
      this.comment.nativeElement.textContent = this.commentPlaceholder;
    }
  }

  ngOnChanges() {
    if (this.newComment && this.displayed !== 'edit') {
      this.switchMode();
    } else if (!this.newComment) {
      this.switchMode();
    }
  }
}
