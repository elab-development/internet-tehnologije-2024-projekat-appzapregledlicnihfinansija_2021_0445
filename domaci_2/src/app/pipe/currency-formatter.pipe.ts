import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormatter',
  standalone: true
})
export class CurrencyFormatterPipe implements PipeTransform {

  transform(value: number, currencyCode: string = 'EUR', locale: string = 'en-US'): string {
    if (value == null) {
      return '';
    }

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
    }).format(value);
  }
}
