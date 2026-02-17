import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rupiah',
})
export class RupiahPipe implements PipeTransform {
  transform(value: number, symbol: string = 'Rp', decimal: number = 0): string {
    return (
      `${symbol}.` +
      ' ' +
      value.toLocaleString('id-ID', {
        minimumFractionDigits: decimal,
        maximumFractionDigits: decimal,
      })
    );
  }
}
