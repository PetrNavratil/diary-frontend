import { Injectable } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import 'moment/locale/cs';
import * as moment from 'moment';

@Injectable()
export class LanguageService {

  constructor(private translate: TranslateService) {
  }

  init(){
    this.translate.setDefaultLang('cs');
    if(localStorage.getItem('language')){
      moment.locale(localStorage.getItem('language'));
      this.translate.use(localStorage.getItem('language'));
    }
  }

  changeLanguage(language: string): void {
    localStorage.setItem('language', language);
    moment.locale(language);
    this.translate.use(language);
  }

  getCurrent(): string {
    return this.translate.currentLang;
  }

  instantTranslate(path: string): string {
    return this.translate.instant(path);
  }

}
