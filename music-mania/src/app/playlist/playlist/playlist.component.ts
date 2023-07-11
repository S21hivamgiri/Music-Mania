import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { sortSongsByProperty } from '../../utility/sort-shuffle';
import { environment } from '../../../environments/environment';
import { Track } from '../../model/track.model';
import { TrackStore } from '../../services/track-store';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { filterSongs } from '../../utility/filter-song';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { Subject, combineLatest } from 'rxjs';
import { DEFAULT_SETTING, DEFAULT_TRACK } from 'src/app/common/constants';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit, OnDestroy {
  @Input() searchItem = '';
  @Input() matOpened = false;
  @Output() playAudio = new EventEmitter();
  @Output() closeSideBar = new EventEmitter();

  currentSong = DEFAULT_TRACK;
  settings = DEFAULT_SETTING;
  tracks: Track[] = [];
  searchedPlaylist: Track[] = [];
  textValueSubject: Subject<void> = new Subject();
  private readonly destroy = new Subject<void>

  constructor(private trackStore: TrackStore) { }

  ngOnInit(): void {
    combineLatest([this.trackStore.currentSong, this.trackStore.settings]).pipe(takeUntil(this.destroy)).subscribe(
      ([currentSong, settings]) => {
        this.currentSong = currentSong;
        this.settings = settings;
      });
    this.trackStore.loadAllTracks().pipe(take(1)).subscribe((data) => {
      this.tracks = data;
      this.filterSong();
    });

    this.textValueSubject
      .pipe(debounceTime(300), takeUntil(this.destroy))
      .subscribe(() => {
        this.filterSong();
      });
  }

  closeSideNav() {
    this.closeSideBar.emit();
  }

  onSearch(searchText: string) {
    this.searchItem = searchText;
    this.filterSong();
  }

  setSearch() {
    this.settings.isSearch = !this.settings.isSearch;
    this.trackStore.settings.next(this.settings);
  }

  isCurrentPlaylist() {
    return (this.settings.currentPlaylist.length === this.searchedPlaylist.length) && (
      this.settings.currentPlaylist.every(this_i => { return this.searchedPlaylist.some(e => this_i._id === e._id) }));
  }

  getCurrentIndex() {
    if (!this.isCurrentPlaylist()) {
      return this.settings.currentTrackIndex;
    } else {
      return this.settings.currentPlaylist.findIndex((data) => { return data._id === this.currentSong._id });
    }
  }

  getPlayList() {
    return this.isCurrentPlaylist() ? this.settings.currentPlaylist : this.searchedPlaylist;
  }

  onKeyDown() {
    this.textValueSubject.next();
  }

  setCurrentIndex(i: number, id: string) {
    const isSamePlayList = this.isCurrentPlaylist();
    if (isSamePlayList && (this.currentSong._id === id))
      return;
    if (this.currentSong._id === id && !isSamePlayList) {
      this.settings.currentPlaylist = this.searchedPlaylist;
      this.settings.currentTrackIndex = i;
      return;
    }
    if (!isSamePlayList) {
      this.settings.currentPlaylist = this.searchedPlaylist;
    }

    this.settings.audioStatus = false;
    this.settings.currentDuration = 0;
    this.settings.currentTrackIndex = i;
    this.trackStore.settings.next(this.settings);
    this.playAudio.emit();
  }

  getThumbNailSrc(id: string) {
    return this.settings.currentPlaylist.length && id ? `${environment.streamAddress}images/thumbnail/${id}.png` : '/assets/music-thumbnail.png';
  }

  sortSongByProperty() {
    if (!this.isCurrentPlaylist()) {
      this.searchedPlaylist = sortSongsByProperty(this.searchedPlaylist, this.settings.sort);
    } else {
      this.searchedPlaylist = sortSongsByProperty(this.searchedPlaylist, this.settings.sort);
      this.settings.currentPlaylist = sortSongsByProperty(this.settings.currentPlaylist, this.settings.sort);
    }
  }


  drop(event: CdkDragDrop<Track[]>) {
    if (event.previousIndex === this.settings.currentTrackIndex) {
      this.settings.currentTrackIndex = event.currentIndex;
    }
    else if (event.previousIndex < this.settings.currentTrackIndex && event.currentIndex >= this.settings.currentTrackIndex) { --this.settings.currentTrackIndex; }
    else if (event.previousIndex >= this.settings.currentTrackIndex && event.currentIndex <= this.settings.currentTrackIndex) { ++this.settings.currentTrackIndex; }
    moveItemInArray(this.settings.currentPlaylist, event.previousIndex, event.currentIndex);
    this.trackStore.settings.next(this.settings);
  }

  sortSong(sortKey = 'title') {
    this.settings.sort = sortKey;
    this.sortSongByProperty();
    //Set the current Index with respect to sorted list if current playlist === searched playlist
    this.settings.currentTrackIndex = this.getCurrentIndex();
    this.trackStore.settings.next(this.settings);
  }

  closePlayList() {
    this.closeSideNav();
    this.settings.isSearch = false;
    this.searchItem = '';
    this.filterSong();
  }

  filterSong() {
    filterSongs(this);
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
