import { Component, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent{

  @ViewChild('title') titleRef: ElementRef;
  @Input() padded = true;

}
