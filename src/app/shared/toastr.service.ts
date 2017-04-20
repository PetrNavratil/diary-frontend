import { Injectable } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';
@Injectable()
export class ToastrService {

  constructor(private toastr: ToastsManager){
  }

  showSuccess(content: string, title: string): void{
    console.log('fck?');
    this.toastr.success(content, title);
  }

  showError(content: string, title: string): void {
    this.toastr.error(content, title);
  }

}