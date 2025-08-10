import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutesToHours'
})
export class MinutesToHoursPipe implements PipeTransform {
  transform(value: number | undefined): string {
    if (!value && value !== 0) return '';
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    return `${hours}h${minutes.toString().padStart(2, '0')}`;
  }
}
