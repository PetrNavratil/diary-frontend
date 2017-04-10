import { Directive, ElementRef, OnInit } from '@angular/core';
@Directive({selector: '[noPaddingCard]'})

export class NoPaddingCard implements OnInit {
  constructor(private el: ElementRef) {
  }

  ngOnInit() {
    let tmp = this.el.nativeElement.getElementsByClassName('card-container')[0];
    tmp.style.padding = '0';
  }
}