import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toTitleCase',
})
export class ToTitleCasePipe implements PipeTransform {
  transform(value: string): string {
    return value
      .trim()
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[_\\-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}
