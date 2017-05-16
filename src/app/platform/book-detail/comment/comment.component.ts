import {
  Component, Input, Output, EventEmitter, ViewChild, ElementRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { DiaryComment } from '../../../models/comment.model';
import { getImageUrl } from '../../../shared/getImageUrl';
import * as moment from 'moment';

@Component({
  selector: 'app-comment',
  templateUrl: 'comment.component.html',
  styleUrls: ['comment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentComponent {

  /**
   * States whether comment is editable
   * @type {boolean}
   */
  @Input() editable = false;
  /**
   * Comment data
   * @type {DiaryComment}
   */
  @Input() commentData: DiaryComment;
  /**
   * Event after clicking on edit button
   * @type {EventEmitter<DiaryComment>}
   */
  @Output() editComment = new EventEmitter<DiaryComment>();
  /**
   * Event after click on add button
   * @type {EventEmitter<DiaryComment>}
   */
  @Output() addComment = new EventEmitter<DiaryComment>();
  /**
   * Event after clicking of delete button
   * @type {EventEmitter<DiaryComment>}
   */
  @Output() deleteComment = new EventEmitter<DiaryComment>();
  /**
   * Holds edit box element
   * @type {ElementRef}
   */
  @ViewChild('commentEdit') comment: ElementRef;
  /**
   * States wheter HTTP request is in progress
   * @type {boolean}
   */
  @Input() loading = false;
  /**
   * Comment placeholder
   * @type {string}
   */
  commentPlaceholder = 'Přidejte Váš komentář ke knize...';
  /**
   * Holds state of edit box
   * @type {boolean}
   */
  focused = false;

  constructor() {
  }

  /**
   * Emits event after click on edit button
   */
  edit(): void {
    let text = this.comment.nativeElement.textContent.trim();
    if (text.length > 0 && text !== this.commentPlaceholder) {
      this.editComment.emit(Object.assign({}, this.commentData, {text: text}));
    }
  }

  /**
   * Emits event after click on add button
   */
  add(): void {
    let text = this.comment.nativeElement.textContent.trim();
    if (text.length > 0 && text !== this.commentPlaceholder) {
      this.addComment.emit(Object.assign({}, this.commentData, {text: text}));
    }
  }

  /**
   * Emits event after click on remove button
   */
  remove(): void {
    this.deleteComment.emit(this.commentData);
  }

  /**
   * Removes placeholder from edit box after click
   */
  removePlaceholder(): void {
    this.focused = true;
    if (this.comment.nativeElement.textContent.trim() === this.commentPlaceholder) {
      this.comment.nativeElement.textContent = '';
    }
  }

  /**
   * Adds placeholder to the edit box after edit box blur
   */
  setPlaceholder(): void {
    this.focused = false;
    if (this.comment.nativeElement.textContent.trim().length === 0) {
      this.comment.nativeElement.textContent = this.commentPlaceholder;
    }
  }

  /**
   * Gets avatar url for template
   * @returns {string}
   */
  get avatarUrl(): string {
    return getImageUrl(this.commentData.userAvatar);
  }

  /**
   * Gets comment time for template
   * @returns {string}
   */
  get time(): string {
    return this.commentData.date.length > 0 ? moment(this.commentData.date).format('LLL') : '';
  }

  /**
   * Sets edit box as editable
   */
  setEditable(): void {
    if (this.editable) {
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
