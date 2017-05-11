/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BookPreviewComponent } from './book-preview.component';

describe('BookPreviewComponent', () => {
  let component: BookPreviewComponent;
  let fixture: ComponentFixture<BookPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BookPreviewComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
