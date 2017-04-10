import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-loading-button',
  templateUrl: './loading-button.component.html',
  styleUrls: ['./loading-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LoadingButtonComponent {

  @Input() loading = false;
  @Input() color = 'primary';
  @Input() icon = '';
  @Input() title = '';
  @Input() disabled = false;
}
