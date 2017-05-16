import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-loading-button',
  templateUrl: './loading-button.component.html',
  styleUrls: ['./loading-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LoadingButtonComponent {

  /**
   * States whether button is in loading state
   * @type {boolean}
   */
  @Input() loading = false;
  /**
   * Sets color of button
   * @type {string}
   */
  @Input() color = 'primary';
  /**
   * Sets icon of button
   * @type {string}
   */
  @Input() icon = '';
  /**
   * Sets title of button
   * @type {string}
   */
  @Input() title = '';
  /**
   * States whether button is disabled
   * @type {boolean}
   */
  @Input() disabled = false;
}
