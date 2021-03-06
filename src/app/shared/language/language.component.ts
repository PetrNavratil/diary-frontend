import { Component } from '@angular/core';
import { LanguageService } from '../language.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent {

  constructor(private language: LanguageService) {
  }

  /**
   * Sets language based on parameter
   * @param language
   */
  setLanguage(language: string): void{
    this.language.changeLanguage(language);
  }

}
