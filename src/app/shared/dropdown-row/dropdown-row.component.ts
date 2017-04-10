import { Component, trigger, state, style, transition, animate, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

const COLLAPSED = 'collapsed';
const EXPANDED = 'expanded';

@Component({
  selector: 'app-dropdown-row',
  templateUrl: './dropdown-row.component.html',
  styleUrls: ['./dropdown-row.component.scss'],
  animations: [
    trigger('expandable', [
      state(COLLAPSED, style({'height': '0', 'opacity': '0'})),
      state(EXPANDED, style({'height': '*', 'opacity': '1'})),
      transition('* => *', animate('500ms ease-out'))
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class DropdownRowComponent {

  state: string = COLLAPSED;
  @Output() status: EventEmitter<string> = new EventEmitter<string>();

  toggle() {
    this.state = this.state === COLLAPSED ? EXPANDED : COLLAPSED;
    this.status.emit(this.state);
  }
}
