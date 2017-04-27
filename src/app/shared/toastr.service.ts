import { Injectable } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';
@Injectable()
export class ToastrService {

  constructor(private toastr: ToastsManager){
    this.toastr.onClickToast()
      .subscribe((toast: any) => {
        if(toast.data && toast.data.error){
          location.reload();
        }
      });
  }

  showSuccess(content: string, title: string, show?: boolean): void{
   if(localStorage.getItem('id_token') || show){
     this.toastr.success(content, title);
   }
  }

  showError(content: string, title: string, show?: boolean): void {
    if(localStorage.getItem('id_token') || show){
      this.toastr.error(content, title, {data: {error: true}, dismiss: 'click'})
    }
  }

}