import {
  Component, AfterViewChecked, OnDestroy, ElementRef, animate, transition, style,
  state, trigger, ViewChild, Input, ChangeDetectorRef, ChangeDetectionStrategy
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownComponent implements AfterViewChecked, OnDestroy {

  /**
   * Tether for dropdown
   * @type {Tether}
   */
  tether: Tether;
  /**
   * States whether dropdown is visible
   * @type {string}
   */
  state: string = COLLAPSED;
  /**
   * Holds dropdown element
   * @type {ElementRef}
   */
  @ViewChild('dropdownContent') dropdown: ElementRef;
  /**
   * Text of dropdown button
   * @type {string}
   */
  @Input() buttonTitle: string = '';
  /**
   * States whether dropdown should be closed after dropdown option is clicked
   * @type {boolean}
   */
  @Input() closeOnClick: boolean = false;
  /**
   * States whether button is disabled
   * @type {boolean}
   */
  @Input() disabled = false;
  /**
   * Provides id of this component
   */
  @Input() dropdownId: string;

  constructor(private el: ElementRef, private cd: ChangeDetectorRef) {
    // adds listener to close dropdown after click outside of it
    document.body.addEventListener('click', (event) => {
      if (!this.el.nativeElement.contains(event.target)) {
        this.state = COLLAPSED;
        this.cd.markForCheck();
      }
    });
  }

  /**
   * Show/hides dropdown after button has been clicked
   */
  toggle(): void {
    this.state = this.state === EXPANDED ? COLLAPSED : EXPANDED;
  }

  ngAfterViewChecked() {
    // sets tether
    this.tether = new Tether({
      element: `#dropdown-content${this.dropdownId}`,
      target: `#dropdown-button${this.dropdownId}`,
      attachment: 'top left',
      targetAttachment: 'bottom left'
    });
  }

  ngOnDestroy() {
    // removes tether
    this.tether.disable();
    this.tether.destroy();
    this.dropdown.nativeElement.parentElement.removeChild(this.dropdown.nativeElement);
  }


  /**
   * Closes dropdown after clicking on it
   */
  dropdownClick(): void {
    if (this.closeOnClick) {
      this.toggle()
    }
  }

}
