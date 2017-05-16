import { Injectable } from '@angular/core';
import { Http, ResponseContentType, RequestOptionsArgs } from '@angular/http';
import { environment } from '../../environments/environment';
import { createOptions } from './createOptions';
import { ReplaySubject, Observable } from 'rxjs';
import { BookStatus } from '../models/book-status.enum';
import { ToastrService } from './toastr.service';
import { LanguageService } from './language.service';

declare function saveAs(data: Blob | File, filename?: string, disableAutoBom?: boolean);

@Injectable()
export class PdfService {

  /**
   * Subject for pdf loading
   * @type {ReplaySubject<boolean>}
   */
  loading: ReplaySubject<boolean> = new ReplaySubject<boolean>();
  /**
   * Observable of pdf loading
   * @type {Observable<boolean>}
   */
  loading$: Observable<boolean> = this.loading.asObservable();

  constructor(private http: Http,
              private language: LanguageService,
              private toastr: ToastrService) {
    this.loading.next(false);
  }

  /**
   * Requests API for PDF of book detail
   * @param id
   */
  generateBookDetailPdf(id: number): void{
    // sets headers
    let options: RequestOptionsArgs = createOptions();
    options.responseType = ResponseContentType.Blob;
    // set loading
    this.loading.next(true);
    // send request
    this.http.get(`${environment.apiUrl}/pdfBook/${id}`, options).subscribe(
      data => {
        // get file
        let file = new Blob([data.blob()], {type: 'application/pdf'});
        // open dialogue
        saveAs(file, `book-detail-${id}.pdf`);
        this.loading.next(false);
        this.toastr.showSuccess(
          `${this.language.instantTranslate('toasts.pdf.detailSuc')}`,
          `${this.language.instantTranslate('toasts.pdf.title')}`
        );
      },
      () => {
        this.loading.next(false);
        this.toastr.showError(
          `${this.language.instantTranslate('toasts.pdf.detailFail')}${this.language.instantTranslate('toasts.refresh')}`,
          `${this.language.instantTranslate('toasts.pdf.title')}`
        );
      }
    )
  }

  /**
   * Requests API for PDF of book list
   * @param status
   */
  generateBooksPdf(status: BookStatus): void{
    // sets headers
    let options: RequestOptionsArgs = createOptions();
    options.responseType = ResponseContentType.Blob;
    this.loading.next(true);
    // sends request
    this.http.get(`${environment.apiUrl}/pdfBooks/${status}`, options).subscribe(
      data => {
        // get file
        let file = new Blob([data.blob()], {type: 'application/pdf'});
        // open dialogue
        saveAs(file, `books-${BookStatus[status]}.pdf`);
        this.loading.next(false);
        this.toastr.showSuccess(
          `${this.language.instantTranslate('toasts.pdf.listSuc')}`,
          `${this.language.instantTranslate('toasts.pdf.title')}`
        );
      },
      () => {
        this.loading.next(false);
        this.toastr.showError(
          `${this.language.instantTranslate('toasts.pdf.listFail')}${this.language.instantTranslate('toasts.refresh')}`,
          `${this.language.instantTranslate('toasts.pdf.title')}`
        );
      }
    )
  }

  generateBooksTxt(status: BookStatus){
    // set headers
    let options: RequestOptionsArgs = createOptions();
    options.responseType = ResponseContentType.Blob;
    this.loading.next(true);
    // send request
    this.http.get(`${environment.apiUrl}/txt/${status}`, options).subscribe(
      data => {
        // get file
        let file = new Blob([data.blob()], {type: 'text/plain'});
        // open dialogue
        saveAs(file, `books-${BookStatus[status]}.txt`);
        this.loading.next(false);
        this.toastr.showSuccess(
          `${this.language.instantTranslate('toasts.pdf.listSuc')}`,
          `${this.language.instantTranslate('toasts.pdf.title')}`
        );
      },
      () => {
        this.loading.next(false);
        this.toastr.showError(
          `${this.language.instantTranslate('toasts.pdf.listFail')}${this.language.instantTranslate('toasts.refresh')}`,
          `${this.language.instantTranslate('toasts.pdf.title')}`
        );
      }
    )
  }

}
