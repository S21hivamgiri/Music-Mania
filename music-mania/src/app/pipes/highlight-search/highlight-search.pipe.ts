import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightSearch',
})
export class HighlightSearchPipe implements PipeTransform {

  transform(value: string, searchItem: string): string {
    if (!searchItem || !value) {
      return value;
    }

    const regex = new RegExp(searchItem, 'i');
    const match = String(value).match(regex);
    if (!match) {
      return value;
    }

    return value.replace(regex, `<span class='highlight'>${match[0]}</span>`);
  }
}
