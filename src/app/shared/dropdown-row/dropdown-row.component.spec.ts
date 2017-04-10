/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DropdownRowComponent } from './dropdown-row.component';

describe('DropdownRowComponent', () => {
  let component: DropdownRowComponent;
  let fixture: ComponentFixture<DropdownRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DropdownRowComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
