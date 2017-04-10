import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-my-input',
  templateUrl: './my-input.component.html',
  styleUrls: ['./my-input.component.scss']
})
export class MyInputComponent implements OnInit {

  constructor() {
  }

  @ViewChild('input') focusElement: ElementRef;
  value = '';

  ngOnInit() {
  }

  hidden = false;


  onClick() {
    this.hidden = true;
    this.focusElement.nativeElement.focus();
  }

  onBlur() {
    this.hidden = false;
  }

}
