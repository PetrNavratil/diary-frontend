import * as moment from 'moment';
import Duration = moment.Duration;

export function getDurationFormat(time: moment.Duration, language: string): string {
  let formatted: string = '';
  if(!time.milliseconds()){
    return '-';
  }
  if (language === 'cs') {
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
          formatted += `${time.weeks()} týdnů `;
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
  } else {
    if (time.years()) {
      switch (time.years()) {
        case 1:
          formatted = '1 year ';
          break;
        default:
          formatted = `${time.years()} years `;
      }
    }
    if (time.months()) {
      switch (time.months()) {
        case 1:
          formatted += '1 month ';
          break;
        default:
          formatted += `${time.months()} months `;
      }
    }
    if (time.weeks()) {
      switch (time.weeks()) {
        case 1:
          formatted += '1 week ';
          break;
        default:
          formatted += `${time.weeks()} weeks `;
      }
    }
    if (time.days()) {
      switch (time.days()) {
        case 1:
          formatted += '1 day ';
          break;
        default:
          formatted += `${time.days()} days `;
      }
    }
    if (time.hours()) {
      switch (time.hours()) {
        case 1:
          formatted += '1 hour ';
          break;
        default:
          formatted += `${time.hours()} hours `;
      }
    }
    if (time.minutes()) {
      switch (time.minutes()) {
        case 1:
          formatted += '1 minute ';
          break;
        default:
          formatted += `${time.minutes()} minutes `;
      }
    }
    if (time.seconds()) {
      switch (time.seconds()) {
        case 1:
          formatted += '1 second ';
          break;
        default:
          formatted += `${time.seconds()} seconds `;
      }
    }
  }
  return formatted;
}



export function simpleDuration(time: moment.Duration): string{
  let formatted = '';
  if (time.years()) {
    formatted = time.years() > 9 ? `${formatted}${time.years()}:`: `${formatted}0${time.years()}:`;
  }
  if (time.months()) {
    formatted = time.months() > 9 ? `${formatted}${time.months()}:`: `${formatted}0${time.months()}:`;
  }
  if (time.weeks()) {
    formatted = time.weeks() > 9 ? `${formatted}${time.weeks()}:`: `${formatted}0${time.weeks()}:`;
  }
  if (time.days()) {
    formatted = time.days() > 9 ? `${formatted}${time.days()}:`: `${formatted}0${time.days()}:`;
  }
  formatted = time.hours() > 9 ? `${formatted}${time.hours()}:`: `${formatted}0${time.hours()}:`;
  formatted = time.minutes() > 9 ? `${formatted}${time.minutes()}:`: `${formatted}0${time.minutes()}:`;
  formatted = time.seconds() > 9 ? `${formatted}${time.seconds()}`: `${formatted}0${time.seconds()}`;
  return formatted;
}