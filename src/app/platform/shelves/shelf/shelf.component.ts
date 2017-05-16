import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Shelf } from '../../../models/shelf.model';

@Component({
  selector: 'app-shelf',
  templateUrl: 'shelf.component.html',
  styleUrls: ['shelf.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShelfComponent {
  /**
   * Shelf data
   * @type {Shelf}
   */
  @Input() shelf: Shelf;
  /**
   * States whether shelf is editable
   * @type {boolean}
   */
  @Input() editable = true;
  /**
   * Array of existing shelf names
   * @type {string[]}
   */
  @Input() shelfNames: string[] = [];
  /**
   * States whether data are loading
   * @type {boolean}
   */
  @Input() loading = false;
  /**
   * Emitter for removing shelf
   * @type {EventEmitter<number>}
   */
  @Output() removeShelf: EventEmitter<number> = new EventEmitter<number>();
  /**
   * Emitter for updating shelf
   * @type {EventEmitter<Shelf>}
   */
  @Output() updateShelf: EventEmitter<Shelf> = new EventEmitter<Shelf>();
  /**
   * Emitter for going to the detail section of book
   * @type {EventEmitter<number>}
   */
  @Output() goToDetail: EventEmitter<number> = new EventEmitter<number>();
  /**
   * Emitter for copying friend's shelf to user's shelves
   * @type {EventEmitter<number>}
   */
  @Output() copyShelf: EventEmitter<number> = new EventEmitter<number>();
  /**
   * States whether shelf is expanded
   * @type {boolean}
   */
  status = false;
  /**
   * Shelf name element
   * @type {ElementRef}
   */
  @ViewChild('shelfName') shelfElement: ElementRef;

  constructor(private cd: ChangeDetectorRef) {
  }

  /**
   * Emits event after delete button has been clicked
   * @param id
   * @param event
   */
  deleteShelf(id: number, event): void {
    event.stopPropagation();
    this.removeShelf.emit(id);
  }

  /**
   * Emits event after edit button has been clicked
   * @param event
   */
  editShelf(event): void {
    event.stopPropagation();
    this.shelf.name = this.shelfElement.nativeElement.textContent.trim();
    this.updateShelf.emit(this.shelf);
  }

  /**
   * Toggles expanded status
   * @param status
   */
  setStatus(status: boolean): void {
    this.status = status;
  }

  /**
   * Emits event after book has been clicked
   * @param id
   */
  goToBook(id: number): void {
    this.goToDetail.emit(id);
  }

  /**
   * Checks if shelf name is unique after rename
   * @returns {boolean}
   */
  get unique(): boolean {
    if (this.shelfElement) {
      return this.shelfNames.filter(shelf => shelf === this.shelfElement.nativeElement.textContent.trim()).length === 1;
    } else {
      return true;
    }
  }

  /**
   * Forces redraw of component after input is changed
   */
  getName(): void {
    this.cd.markForCheck();
  }

  /**
   * Emits event after copy button has been clicked
   * @param id
   * @param event
   */
  copyShelfF(id: number, event): void {
    event.stopPropagation();
    this.copyShelf.emit(id);
  }

}
