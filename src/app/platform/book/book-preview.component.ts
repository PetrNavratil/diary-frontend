import { Component, Input, trigger, state, style, transition, animate } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { getLargeImage } from '../../shared/getLargeImage';
import { Book } from '../../models/book.model';

const HOVERED = 'hovered';
const STATIC = 'statis';

@Component({
  selector: 'app-book-preview',
  templateUrl: 'book-preview.component.html',
  styleUrls: ['book-preview.component.scss'],
  animations: [
    trigger('hover', [
      state(HOVERED, style({'height': '50%', 'width': '40%', 'right': '10px', 'top': '20px'})),
      state(STATIC, style({'height': '100%', 'width': '100%', 'right': '0', 'top': '0'})),
      transition('* => *', animate('300ms'))
    ])
  ],
})
export class BookPreviewComponent {

  /**
   * Book information
   * @type {Book}
   */
  @Input() book: Book;

  /**
   * Book element state
   * @type {string}
   */
  state = STATIC;

  constructor(private sanitizer: DomSanitizer) {
  }

  /**
   * Sanitized provided url to for use in template
   * @param url
   * @returns {SafeStyle}
   */
  sanitize(url: string): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(`url('${getLargeImage(url)}')`);
  }

  /**
   * Changes state of element after hover
   */
  hover(): void {
    this.state = HOVERED;
  }

  /**
   * Changes state of element after mouse leaves element
   */
  leave(): void {
    this.state = STATIC;
  }
}
