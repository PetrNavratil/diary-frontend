import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Shelf } from '../../shared/models/shelf.model';

@Component({
  selector: 'app-shelf',
  templateUrl: './shelf.component.html',
  styleUrls: ['./shelf.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShelfComponent {
  @Input() shelf: Shelf;
  @Input() editable = true;
  @Input() shelfNames: string[] = [];
  @Input() loading = false;
  @Output() removeShelf: EventEmitter<number> = new EventEmitter<number>();
  @Output() updateShelf: EventEmitter<Shelf> = new EventEmitter<Shelf>();
  @Output() goToDetail: EventEmitter<number> = new EventEmitter<number>();
  @Output() copyShelf: EventEmitter<number> = new EventEmitter<number>();
  status = false;
  @ViewChild('shelfName') shelfElement: ElementRef;

  constructor(private cd: ChangeDetectorRef){

  }

  deleteShelf(id: number, event) {
    event.stopPropagation();
    this.removeShelf.emit(id);
  }

  editShelf(event) {
    event.stopPropagation();
    this.shelf.name = this.shelfElement.nativeElement.textContent.trim();
    this.updateShelf.emit(this.shelf);
  }

  setStatus(status: boolean) {
    this.status = status;
  }

  goToBook(id: number) {
    this.goToDetail.emit(id);
  }

  get unique(){
    if(this.shelfElement){
      return this.shelfNames.filter(shelf => shelf === this.shelfElement.nativeElement.textContent.trim()).length === 1;
    } else{
      return true;
    }
  }

  getName(){
    this.cd.markForCheck();
  }

  copyShelfF(id: number, event){
    event.stopPropagation();
    this.copyShelf.emit(id);
  }

}
