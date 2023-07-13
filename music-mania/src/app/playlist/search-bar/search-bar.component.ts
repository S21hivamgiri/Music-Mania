import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DEFAULT_SETTING, DEFAULT_TRACK, HOTLIST_ITEMS } from 'src/app/common/constants';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnChanges, OnDestroy {
  @ViewChild('searchInput') searchTextInput?: ElementRef;
  @Input() settings = DEFAULT_SETTING;
  @Input() searchItem = '';
  @Input() currentSong = DEFAULT_TRACK;
  @Input() matOpened = false;
  @Input() isSearching = false;
  @Output() onKeyDown = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();

  private timeOut?: ReturnType<typeof setTimeout>;
  readonly hotListItems = HOTLIST_ITEMS;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isSearching'] || changes['searchItem']) {
      this.timeOut = setTimeout(() => {
        if (this.searchTextInput) {
          this.searchTextInput?.nativeElement.focus();
          if (changes['searchItem']) {
            (this.searchTextInput?.nativeElement as HTMLInputElement).value = this.searchItem
            this.search.emit(this.searchItem);
            return;
          }
          this.search.emit((this.searchTextInput?.nativeElement as HTMLInputElement).value);
        }
      }, 100);
    }
  }

  keyDown(event: Event) {
    event.stopPropagation();
    this.onKeyDown.emit();
  }

  searchemit(event: Event) {
    this.search.emit((event.target as HTMLInputElement).value);
  }

  ngOnDestroy(): void {
    if (this.timeOut) clearTimeout(this.timeOut);
  }
}
