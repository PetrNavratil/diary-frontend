/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NothingComponent } from './nothing.component';

describe('NothingComponent', () => {
  let component: NothingComponent;
  let fixture: ComponentFixture<NothingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NothingComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NothingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
