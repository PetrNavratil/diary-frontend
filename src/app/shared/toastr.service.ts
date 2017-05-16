import { Injectable } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';
@Injectable()
export class ToastrService {

  constructor(private toastr: ToastsManager){
    // register onclick event
    this.toastr.onClickToast()
      .subscribe((toast: any) => {
        // reload only in case of error toast
        if(toast.data && toast.data.error){
          location.reload();
        }
      });
  }

  /**
   * Shows success toast
   * @param content
   * @param title
   * @param show
   */
  showSuccess(content: string, title: string, show?: boolean): void{
   if(localStorage.getItem('id_token') || show){
     this.toastr.success(content, title);
   }
  }

  /**
   * Shows error toast
   * @param content
   * @param title
   * @param show
   */
  showError(content: string, title: string, show?: boolean): void {
    if(localStorage.getItem('id_token') || show){
      this.toastr.error(content, title, {data: {error: true}, dismiss: 'click'})
    }
  }

}