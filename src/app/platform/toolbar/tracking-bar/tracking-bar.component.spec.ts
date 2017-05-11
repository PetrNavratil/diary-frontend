/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TrackingBarComponent } from './tracking-bar.component';

describe('TrackingBarComponent', () => {
  let component: TrackingBarComponent;
  let fixture: ComponentFixture<TrackingBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrackingBarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
