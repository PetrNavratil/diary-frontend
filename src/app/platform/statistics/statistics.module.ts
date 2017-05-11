import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { StatisticsComponent } from './statistics.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    StatisticsComponent
  ],
  exports: [
    StatisticsComponent
  ]
})
export class StatisticsModule { }
