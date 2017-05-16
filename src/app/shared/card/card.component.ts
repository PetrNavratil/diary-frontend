import { Component, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent{

  /**
   * Holds title element
   * @type {ElementRef}
   */
  @ViewChild('title') titleRef: ElementRef;
  /**
   * States whether card content should be padded
   * @type {boolean}
   */
  @Input() padded = true;

}
