import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  /**
   * Truncates passed value based on provided limit.
   * If it truncates value, ... is added to the end of string.
   * @param value
   * @param limit
   * @returns {string}
   */
  transform(value: any, limit: number): string {
    return value.length > limit ? `${value.substring(0, limit)}...` : value;
  }

}
