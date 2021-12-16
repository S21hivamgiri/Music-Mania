import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { sortSongsByProperty } from '../controller/sort-shuffle-controller';
import { environment } from '../environments/environment';
import { Settings } from '../model/settings.model';
import { Track } from '../model/track.model';
import { TrackStore } from '../services/track-store';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { filterSongs } from '../controller/filter-song-controller';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit, OnDestroy {

  @Output() playAudio = new EventEmitter();
  @Output() closeSideBar = new EventEmitter();
  @Input() searchItem = '';
  @Input() matOpened = false;
  @ViewChild('searchInput') searchTextInput?: ElementRef;

  constructor(private trackStore: TrackStore) { }

  hotListItems = ['Arijit Singh', 'I Hate Luv Storys', 'Nazm Nazm', 'K.K.', 'Ajab Prem Ki Ghazab Kahani', 'Mann Mera', 'Sab Tera']
  currentSong!: Track;
  settings!: Settings;
  tracks: Track[] = [];
  searchedPlaylist: Track[] = [];
  textValueSubject: Subject<any> = new Subject();
  timeOut: any;

  closeSideNav() {
    this.closeSideBar.emit();
  }

  setSearch() {
    this.settings.isSearch = !this.settings.isSearch;
    this.trackStore.settings.next(this.settings);
    this.setSearchBarFocus();
  }

  setSearchBarFocus() {
    //The setTimOut is set because as soona s search bar opens focus cannot be attained 10ms timing for opening it after animation. 
    this.timeOut = setTimeout(() => {
      this.searchTextInput?.nativeElement.focus();
      this.filterSong();
    }, 10);
  }

  ngOnInit(): void {
    this.trackStore.currentSong.subscribe((data) => {
      this.currentSong = data;
    });

    this.trackStore.settings.subscribe((data) => {
      this.settings = data;
    });

    this.trackStore.loadAllTracks().subscribe((data) => {
      this.tracks = data;
      this.filterSong();
    });

    this.textValueSubject
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.filterSong();
      });
  }

  isCurrentPlaylist() {
    return (this.settings.currentPlaylist.length === this.searchedPlaylist.length) && (
      this.settings.currentPlaylist.every((this_i, i) => { return this.searchedPlaylist.some(e => this_i._id === e._id) }));
  }

  getCurrentIndex() {
    if (!this.isCurrentPlaylist()) {
      return this.settings.currentTrackIndex;
    } else {
      let currentTrackId = this.currentSong._id
      let data = this.settings.currentPlaylist.findIndex((data) => { return data._id === currentTrackId })
      return data;
    }
  }

  getPlayList(){
  return this.isCurrentPlaylist() ? this.settings.currentPlaylist : this.searchedPlaylist;
  }

  onKeyUp(event: Event) {
    event.stopPropagation();
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

  getThumbNailSrc(title?: string) {
    return this.settings.currentPlaylist.length && title ? `${environment.apiAddress}track/thumbnail/${title}.png` : '/assets/music-thumbnail.png';
  }

  sortSongByProperty() {
    if (!this.isCurrentPlaylist()) {
      this.searchedPlaylist = sortSongsByProperty(this.searchedPlaylist, this.settings.sort);
    } else {
      this.searchedPlaylist = sortSongsByProperty(this.searchedPlaylist, this.settings.sort);
      this.settings.currentPlaylist = sortSongsByProperty(this.settings.currentPlaylist, this.settings.sort);
    }
  }

  sortSongByTitle() {
    this.settings.sort = 'title';
    this.sortSongByProperty();
    //Set the current Index with respect to sorted list if current playlist === searched playlist
    this.settings.currentTrackIndex = this.getCurrentIndex();
  }

  drop(event: CdkDragDrop<Track[]>) {
    if (event.previousIndex === this.settings.currentTrackIndex) this.settings.currentTrackIndex = event.currentIndex;
    else if (event.previousIndex < this.settings.currentTrackIndex && event.currentIndex >= this.settings.currentTrackIndex)
      --this.settings.currentTrackIndex;
    else if (event.previousIndex >= this.settings.currentTrackIndex && event.currentIndex <= this.settings.currentTrackIndex)
      ++this.settings.currentTrackIndex;
    moveItemInArray(this.settings.currentPlaylist, event.previousIndex, event.currentIndex);
    this.trackStore.settings.next(this.settings);
  }

  sortSongByAlbum() {
    this.settings.sort = 'album';
    this.sortSongByProperty();
    this.settings.currentTrackIndex = this.getCurrentIndex();
    this.trackStore.settings.next(this.settings);
  }

  filterSong() {
    filterSongs(this);
  }

  ngOnDestroy() {
    this.textValueSubject.unsubscribe();
    clearTimeout(this.timeOut);
  }
}
