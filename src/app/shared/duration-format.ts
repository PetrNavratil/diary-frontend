import * as moment from 'moment';

export function getDurationFormat(time: moment.Duration): string {
  let formatted: string = '';
  if (time.years()) {
    switch (time.years()) {
      case 1:
        formatted = '1 rok ';
        break;
      case 2:
      case 3:
      case 4:
        formatted = `${time.years()} roky `;
        break;
      default:
        formatted = `${time.years()} let `;
    }
  }
  if (time.months()) {
    switch (time.months()) {
      case 1:
        formatted += '1 měsíc ';
        break;
      case 2:
      case 3:
      case 4:
        formatted += `${time.months()} měsíce `;
        break;
      default:
        formatted += `${time.months()} měsíců `;
    }
  }
  if (time.weeks()) {
    switch (time.weeks()) {
      case 1:
        formatted += '1 týden ';
        break;
      case 2:
      case 3:
      case 4:
        formatted += `${time.weeks()} týdny `;
        break;
      default:
        formatted += `${time.weeks()} měsíců `;
    }
  }
  if (time.days()) {
    switch (time.days()) {
      case 1:
        formatted += '1 den ';
        break;
      case 2:
      case 3:
      case 4:
        formatted += `${time.days()} dny `;
        break;
      default:
        formatted += `${time.days()} dnů `;
    }
  }
  if (time.hours()) {
    switch (time.hours()) {
      case 1:
        formatted += '1 hodina ';
        break;
      case 2:
      case 3:
      case 4:
        formatted += `${time.hours()} hodiny `;
        break;
      default:
        formatted += `${time.hours()} hodin `;
    }
  }
  if (time.minutes()) {
    switch (time.minutes()) {
      case 1:
        formatted += '1 minuta ';
        break;
      case 2:
      case 3:
      case 4:
        formatted += `${time.minutes()} minuty `;
        break;
      default:
        formatted += `${time.minutes()} minut `;
    }
  }
  if (time.seconds()) {
    switch (time.seconds()) {
      case 1:
        formatted += '1 sekunda ';
        break;
      case 2:
      case 3:
      case 4:
        formatted += `${time.seconds()} sekundy `;
        break;
      default:
        formatted += `${time.seconds()} sekund `;
    }
  }
  return formatted;
}