import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Shelf } from '../../shared/models/shelf.model';

@Component({
  selector: 'app-shelf',
  templateUrl: './shelf.component.html',
  styleUrls: ['./shelf.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShelfComponent {
  @Input() shelf: Shelf;
  @Output() removeShelf: EventEmitter<number> = new EventEmitter<number>();
  @Output() updateShelf: EventEmitter<Shelf> = new EventEmitter<Shelf>();
  @Output() goToDetail: EventEmitter<number> = new EventEmitter<number>();
  status: string = 'collapsed';

  deleteShelf(id: number, event) {
    event.stopPropagation();
    this.removeShelf.emit(id);
  }

  editShelf(event) {
    event.stopPropagation();
    this.updateShelf.emit(this.shelf);
  }

  setStatus(status: string) {
    this.status = status;
  }

  goToBook(id: number) {
    this.goToDetail.emit(id);
  }

}
