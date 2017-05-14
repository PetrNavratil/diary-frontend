import { Injectable } from '@angular/core';
import { Http, ResponseContentType, RequestOptionsArgs } from '@angular/http';
import { environment } from '../../environments/environment';
import { createOptions } from './createOptions';
import { ReplaySubject, Observable } from 'rxjs';
import { BookStatus } from '../models/book-status.enum';
import { ToastrService } from './toastr.service';

declare function saveAs(data: Blob | File, filename?: string, disableAutoBom?: boolean);

@Injectable()
export class PdfService {

  loading: ReplaySubject<boolean> = new ReplaySubject<boolean>();
  loading$: Observable<boolean> = this.loading.asObservable();

  constructor(private http: Http, private toastr: ToastrService) {
    this.loading.next(false);
  }

  generateBookDetailPdf(id: number){
    let options: RequestOptionsArgs = createOptions();
    options.responseType = ResponseContentType.Blob;
    this.loading.next(true);
    this.http.get(`${environment.apiUrl}/pdfBook/${id}`, options).subscribe(
      data => {
        let file = new Blob([data.blob()], {type: 'application/pdf'});
        saveAs(file, `book-detail-${id}.pdf`);
        this.loading.next(false);
        this.toastr.showSuccess('Detail knihy byl úspěšně vygenerován.', 'PDF');
      },
      () => {
        this.loading.next(false);
        this.toastr.showError('Detail knihy se nepodařilo vygenerovat.', 'PDF');
      }
    )
  }

  generateBooksPdf(status: BookStatus){
    let options: RequestOptionsArgs = createOptions();
    options.responseType = ResponseContentType.Blob;
    this.loading.next(true);
    this.http.get(`${environment.apiUrl}/pdfBooks/${status}`, options).subscribe(
      data => {
        let file = new Blob([data.blob()], {type: 'application/pdf'});
        saveAs(file, `books-${BookStatus[status]}.pdf`);
        this.loading.next(false);
        this.toastr.showSuccess('Seznam knih byl úspěšně vygenerován.', 'PDF');
      },
      () => {
        this.loading.next(false);
        this.toastr.showError('Seznam knih se nepodařilo vygenerovat.', 'PDF');
      }
    )
  }

}
