import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toSnakeCase',
})
export class ToSnakeCasePipe implements PipeTransform {
  transform(value: string): string {
    return value.trim().toLowerCase().replace(/\s+/g, '_');
  }
}
