import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter, OnChanges } from '@angular/core';
import { EducationModel } from '../../../models/education.model';
import { Dictionary } from './dictionary';

@Component({
  selector: 'app-education',
  templateUrl: 'education.component.html',
  styleUrls: ['education.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EducationComponent implements OnChanges {

  /**
   * Holds literary analysis data
   * @type {EducationModel}
   */
  @Input() data: EducationModel;
  /**
   * Emits event after click on edit button
   * @type {EventEmitter<EducationModel>}
   */
  @Output() dataUpdate: EventEmitter<EducationModel> = new EventEmitter<EducationModel>();

  /**
   * States whether tooltip section is visible
   * @type {boolean}
   */
  hintVisible = false;
  /**
   * Displayed hint
   * @type {string}
   */
  hint = '';
  /**
   * Selected genre
   * @type {Array}
   */
  selectedZanr = [];
  /**
   * Lit. druhy
   * @type {string[]}
   */
  druhs = [
    'Lyrika',
    'Epika',
    'Drama'
  ];
  /**
   * Lit. zanry
   * @type {string}
   */
  zanrs = {
    Epika: [
      'Anekdota',
      'Historka',
      'Bajka',
      'Báje (mýty)',
      'Legenda',
      'Pověst',
      'Pohádka',
      'Povídka',
      'Novela',
      'Romaneto',
      'Epos',
      'Román'
    ],
    Lyrika: [
      'Píseň',
      'Elegie',
      'Hymnus',
      'Óda',
      'Žalmy',
      'Epigram',
      'Pásmo',
      'Balada',
      'Romance',
      'Básnická povídka'
    ],
    Drama: [
      'Tragédie',
      'Komedie',
      'Činohra',
      'Veselohra',
      'Tragikomedie',
      'Absurdní drama',
      'Aktovka',
      'Monodrama'
    ]
  };

  /**
   * Lit. smery
   * @type {string[]}
   */
  smers = [
    'Antika',
    'Středověk',
    'Humanismus a renesance',
    'Baroko',
    'Klasicismus a osvícenství',
    'Preromantismus',
    'Romantismus',
    'Biedermeir',
    'Realismus',
    'Naturalismus',
    'Moderna - Symbolismus',
    'Moderna - Impresionismus',
    'Moderna - Dekadence',
    'Avantgarda - Expresionismus',
    'Avantgarda - Surrealismus',
    'Avantgarda - Dadaismus',
    'Avantgarda - Poetismus',
    'Existencionalismus',
    'Socialistický realismus',
    'Magický realismus',
    'Absurdní drama',
    'Postmoderna'
  ];

  /**
   * Emits event after click on edit button
   * @param form
   */
  saveEducation(form: any): void {
    form.value.id = this.data.id;
    this.dataUpdate.emit(form.value);
  }

  /**
   * Nastavi zanry podle druhu
   * @param druh
   */
  setZanr(druh: any): void {
    this.selectedZanr = this.zanrs[druh.value];
  }

  /**
   * Shows tooltip text after hover
   * @param key
   */
  showHint(key: string): void {
    let dictKey = key.replace(/-|\(|\)| /g, '');
    this.hint = Dictionary[dictKey];
    this.hintVisible = true;
  }

  /**
   * Hides hint
   * @param source
   */
  hideHint(source?: any): void {
    if (source && document.activeElement === source) {
      return;
    } else {
      this.hintVisible = false;
    }
  }

  ngOnChanges() {
    if (this.data && this.data.zanr.length) {
      this.selectedZanr = this.zanrs[this.data.druh];
    }
  }
}
