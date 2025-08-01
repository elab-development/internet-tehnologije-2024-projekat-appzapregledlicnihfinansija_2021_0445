import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(
    value: unknown,
    currency: string = 'RSD',
    locale: string = 'sr-RS'
  ): string {
    let num: number;

    if (typeof value === 'number') {
      num = value;
    } else if (typeof value === 'string') {
      const parsed = parseFloat(value.replace(',', '.'));
      num = Number.isFinite(parsed) ? parsed : 0;
    } else {
      num = 0;
    }

    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency
      }).format(num);
    } catch {
      return `${num.toFixed(2)} ${currency}`;
    }
  }
}