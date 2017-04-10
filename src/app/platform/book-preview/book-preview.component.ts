import { Component, Input, trigger, state, style, transition, animate } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { getLargeImage } from '../../shared/getLargeImage';
import { Book } from '../../shared/models/book.model';

const HOVERED = 'hovered';
const STATIC = 'statis';

@Component({
  selector: 'app-book-preview',
  templateUrl: './book-preview.component.html',
  styleUrls: ['./book-preview.component.scss'],
  animations: [
    trigger('hover', [
      state(HOVERED, style({'height': '50%', 'width': '40%', 'right': '10px', 'top': '20px'})),
      state(STATIC, style({'height': '100%', 'width': '100%', 'right': '0'})),
      transition('* => *', animate('300ms'))
    ])
  ],
})
export class BookPreviewComponent {

  @Input() book: Book;
  state = STATIC;

  constructor(private sanitizer: DomSanitizer) {
  }

  sanitize(url: string): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(`url('${getLargeImage(url)}')`);
  }

  hover() {
    this.state = HOVERED;
  }

  leave() {
    this.state = STATIC;
  }
}
