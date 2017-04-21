import { Injectable } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';
@Injectable()
export class ToastrService {

  constructor(private toastr: ToastsManager){
  }

  showSuccess(content: string, title: string): void{
   if(localStorage.getItem('id_token')){
     this.toastr.success(content, title);
   }
  }

  showError(content: string, title: string): void {
    if(localStorage.getItem('id_token')){
      this.toastr.error(content, title);
    }
  }

}