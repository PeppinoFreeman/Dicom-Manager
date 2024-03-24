import { Pipe, PipeTransform } from '@angular/core';
/**
 * Return the input string with the first letter as an uppercase
 */
@Pipe({
  standalone: true,
  name: 'capitalize',
})
export class CapitalizePipe implements PipeTransform {
  transform(input: string): string {
    return `${input.charAt(0).toUpperCase()}${input.slice(1)}`;
  }
}
