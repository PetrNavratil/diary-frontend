import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ToolbarComponent } from './toolbar.component';
import { TrackingBarComponent } from './tracking-bar/tracking-bar.component';
import { SearcherComponent } from './searcher/searcher.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    ToolbarComponent,
    TrackingBarComponent,
    SearcherComponent
  ],
  exports: [
    ToolbarComponent
  ]
})
export class ToolbarModule { }
