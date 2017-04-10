import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter, OnChanges } from '@angular/core';
import { EducationModel } from '../../shared/models/education.model';
import { Dictionary } from './dictionary';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EducationComponent implements OnChanges {

  @Input() data: EducationModel;
  @Output() dataUpdate: EventEmitter<EducationModel> = new EventEmitter<EducationModel>();

  hintVisible = false;
  hint = '';
  selectedZanr = [];
  druhs = [
    'Lyrika',
    'Epika',
    'Lyrikoepika',
    'Drama'
  ];
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
    Lyrikoepika: [
      'Balada',
      'Romance',
      'Básnická povídka'
    ],
    Lyrika: [
      'Píseň',
      'Elegie',
      'Hymnus',
      'Óda',
      'Žalmy',
      'Epigram',
      'Pásmo'
    ],
    Drama: [
      'Tragédie',
      'Komedie',
      'Činohra',
      'Veselohra',
      'Melodram',
      'Tragikomedie',
      'Absurdní drama',
      'Aktovka',
      'Monodrama'
    ]
  };

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

  ngOnChanges() {
    if (this.data && this.data.zanr.length) {
      this.selectedZanr = this.zanrs[this.data.druh];
    }
  }


  saveEducation(form: any) {
    form.value.id = this.data.id;
    this.dataUpdate.emit(form.value);
  }

  setZanr(druh: any) {
    this.selectedZanr = this.zanrs[druh.value];
  }

  showHint(key: string) {
    let dictKey = key.replace(/-|\(|\)| /g, '');
    this.hint = Dictionary[dictKey];
    this.hintVisible = true;
  }


  hideHint(source?: any) {
    if (source && document.activeElement === source) {
      return;
    } else {
      this.hintVisible = false;
    }

  }
}
