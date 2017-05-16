import { Injectable } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import 'moment/locale/cs';
import * as moment from 'moment';

@Injectable()
export class LanguageService {

  constructor(private translate: TranslateService) {
  }

  /**
   * Based on stored language sets moment and translate libraries
   */
  init(): void {
    this.translate.setDefaultLang('cs');
    if (localStorage.getItem('language')) {
      moment.locale(localStorage.getItem('language'));
      this.translate.use(localStorage.getItem('language'));
    }
  }

  /**
   * Changes language based on passed shortcut
   * @param language
   */
  changeLanguage(language: string): void {
    localStorage.setItem('language', language);
    moment.locale(language);
    this.translate.use(language);
  }

  /**
   * Returns currently used language
   * @returns {string}
   */
  getCurrent(): string {
    return this.translate.currentLang;
  }

  /**
   * Returns translation of property of specified by path
   * @param path
   * @returns {string|any}
   */
  instantTranslate(path: string): string {
    return this.translate.instant(path);
  }
}
