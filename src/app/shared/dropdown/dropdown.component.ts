import {
  Component, AfterViewChecked, OnDestroy, ElementRef, animate, transition, style,
  state, trigger, ViewChild, Input
} from '@angular/core';
import * as Tether from 'tether';

const COLLAPSED = 'collapsed';
const EXPANDED = 'expanded';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  animations: [
    trigger('expandable', [
      state(COLLAPSED, style({'height': '0', 'opacity': '0'})),
      state(EXPANDED, style({'height': '*', 'opacity': '1'})),
      transition('* => *', animate('500ms ease-out'))
    ])
  ]
})
export class DropdownComponent implements AfterViewChecked, OnDestroy {

  tether: Tether;
  state: string = COLLAPSED;
  @ViewChild('dropdownContent') dropdown: ElementRef;
  @Input() buttonTitle: string = '';
  @Input() closeOnClick: boolean = false;
  @Input() disabled = false;

  constructor(private el: ElementRef) {
    document.body.addEventListener('click', (event) => {
      if (!this.el.nativeElement.contains(event.target)) {
        this.state = COLLAPSED;
      }
    });
  }

  toggle() {
    this.state = this.state === EXPANDED ? COLLAPSED : EXPANDED;
  }

  ngAfterViewChecked() {
    this.tether = new Tether({
      element: `#dropdown-content${this.getId()}`,
      target: `#dropdown-button${this.getId()}`,
      attachment: 'top left',
      targetAttachment: 'bottom left'
    });
  }

  ngOnDestroy() {
    this.tether.disable();
    this.tether.destroy();
    this.dropdown.nativeElement.parentElement.removeChild(this.dropdown.nativeElement);
  }

  getId(): string {
    let splitted = this.buttonTitle.split(' ');
    return splitted[splitted.length - 1];
  }

  dropdownClick() {
    if (this.closeOnClick) {
      this.toggle()
    }
  }

}
