import { SPACE, F11, LEFT_ARROW, RIGHT_ARROW, R, S, P, N, L, Z, F, M, UP_ARROW, DOWN_ARROW, X } from '@angular/cdk/keycodes';
import { Component, ViewChild, OnInit, ChangeDetectorRef, ElementRef, AfterContentChecked, OnDestroy, Inject, HostListener } from '@angular/core';
import { TrackStore } from '../services/track-store';
import { Track } from '../model/track.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { environment } from '../environments/environment';
import { DOCUMENT } from '@angular/common';
import { MatSidenav } from '@angular/material/sidenav';
import { fullScreenContoller } from '../controller/full-screen-contoller';
import { setTextColorOnHeader } from '../controller/set-text-colour-controller';
import { getCurrentTimeInFormat, getDurationInFormat, getFormattedTime } from '../controller/time-controller';
import { filterSongs } from '../controller/filter-song-controller';
import { shuffleAllSongs, sortSongsByProperty } from '../controller/sort-shuffle-controller';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-audio-track',
  templateUrl: './audio-track.component.html',
  styleUrls: ['./audio-track.component.scss']
})
export class AudioTrackComponent implements OnInit, AfterContentChecked, OnDestroy {
  @HostListener('document:keydown', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode === SPACE) {
      this.playAudio();
    }
    else if (event.keyCode === F11 || event.keyCode === F) {
      this.lock || this.setFullScreen();
    }
    else if (event.keyCode === X) {
      this.lock || this.setShuffle();
    }
    else if (event.keyCode === LEFT_ARROW) {
      this.lock || this.rewind();
    }
    else if (event.keyCode === RIGHT_ARROW) {
      this.lock || this.forward();
    }
    else if (event.keyCode === UP_ARROW) {
      if (this.volume < 1) this.volume = this.volume + 0.1;
      this.setVolume();
    }
    else if (event.keyCode === DOWN_ARROW) {
      if (this.volume > 0) this.volume = this.volume - 0.1;
      this.setVolume();
    }
    else if (event.keyCode === R) {
      this.lock || (this.loop = !this.loop);
    }
    else if (event.keyCode === P) {
      this.lock || this.prevAudio();
    }
    else if (event.keyCode === N) {
      this.lock || this.nextAudio();
    }
    else if (event.keyCode === Z) {
      this.lock || this.sidenav?.toggle();
    }
    else if (event.keyCode === L) {
      this.lock = false;
      this.setLock();
    }
    else if (event.keyCode === S) {
      this.lock || (this.sidenav?.open() && (this.isSearch = true) && this.setSearchBarFocus())
    }
    else if (event.keyCode === M) {
      this.muteAudio();
    }
    event.preventDefault();
  }

  @ViewChild('sidenav') sidenav?: MatSidenav;
  @ViewChild('searchInput') searchTextInput?: ElementRef;

  textValueSubject: Subject<any> = new Subject();
  hotListItems = ['Arijit Singh', 'I Hate Luv Storys', 'Nazm Nazm', 'K.K.', 'Ajab Prem Ki Ghazab Kahani', 'Mann Mera', 'Sab Tera']
  tracks: Track[] = [];
  searchedPlaylist: Track[] = [];
  currentPlaylist: Track[] = [];
  isSearch = false;
  lock = false;
  elem: any;
  interval: any;
  timeOut: any;
  currentSong: Track = {
    backgroundColor: '',
    _id: '',
    textColor: '',
    title: '',
    artist: [],
    album: '',
    picture: ''
  };

  sort = 'title';
  audioStatus = false;
  audioSource = "";
  duration = 1;
  currentDuration = 0;
  searchItem = '';
  shuffle = true;
  fullScreen = false;
  currentTrackIndex = 0;
  muted = false;
  volume = 1;
  loop = false;

  constructor(private titleService: Title, private trackStore: TrackStore, readonly changeDetectionRef: ChangeDetectorRef, readonly sideNav: ElementRef, @Inject(DOCUMENT) private document: any) { }

  ngOnInit() {
    this.elem = document.documentElement;
    this.trackStore.loadAllTracks().subscribe((data) => {
      this.tracks = data;
      this.currentPlaylist = this.tracks;
      this.filterSong();
      this.sortAndShuffleSongs();
      this.setAudioPlayer();
    });

    this.interval = setInterval(() => {
      this.getDuration();
      this.getCurrentTime();
    }, 500);

    this.textValueSubject
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.filterSong();
      });

    document.addEventListener('fullscreenchange', () => { this.onFullScreen(this) });
    document.addEventListener('webkitfullscreenchange', () => { this.onFullScreen(this) });
    document.addEventListener('mozfullscreenchange', () => { this.onFullScreen(this) });
    document.addEventListener('MSFullscreenChange', () => { this.onFullScreen(this) });
  }

  playAudio() {
    let myAudio: HTMLMediaElement | null = this.getPlayer();
    if (this.audioStatus) {
      myAudio.pause();
      this.audioStatus = false;
    }
    else {
      myAudio.play();
      this.audioStatus = true;
    }
  }

  setLock() {
    this.searchItem = '';
    this.isSearch = false;
    this.sidenav?.close();
    this.lock = !this.lock;
    this.setFullScreen();
  }

  setAudioPlayer() {
    this.currentSong = this.currentPlaylist[this.currentTrackIndex];
    this.titleService.setTitle('MusicMania | ' + this.currentSong.title);
    this.audioSource = `${environment.apiAddress}track/stream/${this.currentSong._id}`;
    let myAudio: HTMLMediaElement | null = this.getPlayer();
    myAudio.src = this.audioSource;
    myAudio.onended = () => { this.nextAudio(); }
    this.getPicture();
    this.settextColor();
  }

  isCurrentPlaylist() {
    return this.currentPlaylist.length == this.searchedPlaylist.length &&
      this.currentPlaylist.every((this_i, i) => { return this_i == this.searchedPlaylist[i] })
  }

  setSearch() {
    this.isSearch = !this.isSearch;
    this.setSearchBarFocus();
  }

  setSearchBarFocus() {
    //The setTimOut is set because as soona s search bar opens focus cannot be attained 10ms timing for opening it after animation. 
    this.timeOut = setTimeout(() => {
      this.searchTextInput?.nativeElement.focus();
    }, 10);
  }

  setSearchBar(searchText?: string) {
    this.sidenav?.open();
    this.isSearch = true;
    this.searchItem = searchText || '';
    this.filterSong();
  }

  getPicture() {
    return this.tracks.length ?
      `${environment.apiAddress}track/image/${this.currentSong?.picture}` : '/assets/music-image.jpg';
  }

  getThumbNailSrc(title?: string) {
    return this.tracks.length && title ? `${environment.apiAddress}track/thumbnail/${title}.png` : '/assets/music-thumbnail.png';
  }

  sortAndShuffleSongs() {
    let allTracks;
    allTracks = sortSongsByProperty(this.currentPlaylist, this.sort);
    if (this.shuffle) shuffleAllSongs(allTracks);
    this.currentPlaylist = allTracks;
  }

  sortSongByTitle() {
    this.sort = 'title';
    this.sortSongByProperty();
    //Set the current Index with respect to sorted list if current playlist === searched playlist
    this.currentTrackIndex = this.getCurrentIndex();
  }

  sortSongByAlbum() {
    this.sort = 'album';
    this.sortSongByProperty();
    this.currentTrackIndex = this.getCurrentIndex();
  }

  sortSongByProperty() {
    if (!this.isCurrentPlaylist()) {
      this.searchedPlaylist = sortSongsByProperty(this.searchedPlaylist, this.sort);
    } else {
      this.searchedPlaylist = sortSongsByProperty(this.searchedPlaylist, this.sort);
      this.currentPlaylist = sortSongsByProperty(this.currentPlaylist, this.sort);
    }
  }

  onKeyUp(event: KeyboardEvent) {
    event.stopPropagation();
    this.textValueSubject.next();
  }

  filterSong() {
    filterSongs(this);
  }

  settextColor() {
    setTextColorOnHeader(this);
  }

  getPlayer() {
    return <HTMLVideoElement>document.getElementsByTagName('audio')[0];
  }

  getDuration() {
    getDurationInFormat(this);
  }

  getCurrentTime() {
    getCurrentTimeInFormat(this);
  }

  formatTimeLabel(value: number) {
    return getFormattedTime(value);
  }

  setShuffle() {
    this.shuffle = !this.shuffle;
    this.sortAndShuffleSongs();
  }

  muteAudio() {
    let myAudio: HTMLMediaElement | null = this.getPlayer();
    if (this.muted) {
      this.muted = false;
      myAudio.volume = this.volume;
    }
    else {
      this.muted = true;
      myAudio.volume = 0;
    }
  }

  setVolume() {
    let myAudio: HTMLMediaElement | null = this.getPlayer();
    myAudio.volume = this.volume;
  }

  prevAudio() {
    this.audioStatus = !this.audioStatus;
    --this.currentTrackIndex;
    this.setAudioPlayer();
    this.playAudio();
  }

  getCurrentIndex() {
    if (!this.isCurrentPlaylist()) {
      return this.currentTrackIndex;
    } else {
      let currentTrackId = this.currentSong._id
      let data = this.currentPlaylist.findIndex((data) => { return data._id === currentTrackId })
      return data;
    }
  }

  setCurrentIndex(i: number, id: string) {
    const isSamePlayList = this.isCurrentPlaylist();
    if (isSamePlayList && (this.currentSong._id === id))
      return;
    if (this.currentSong._id === id && !isSamePlayList) {
      this.currentPlaylist = this.searchedPlaylist;
      this.currentTrackIndex = i;
      return;
    }
    if (!isSamePlayList) this.currentPlaylist = this.searchedPlaylist;

    this.audioStatus = false;
    this.currentTrackIndex = i;
    this.setAudioPlayer();
    this.playAudio();
  }

  nextAudio() {
    this.audioStatus = !this.audioStatus;
    if (this.loop) this.currentTrackIndex;
    else {
      if (this.currentTrackIndex < this.currentPlaylist.length - 1) ++this.currentTrackIndex;
      else this.currentTrackIndex = 0;
    }
    this.setAudioPlayer();
    this.playAudio();
  }

  getNextSong() {
    if (this.loop) return this.currentSong;
    else {
      if (this.currentTrackIndex < this.currentPlaylist.length - 1) return this.currentPlaylist[this.currentTrackIndex + 1];
      else return this.currentPlaylist[0];
    }
  }

  onPlayerInputChange(e: any) {
    let myAudio: HTMLMediaElement | null = this.getPlayer();
    myAudio.currentTime = e.value;
    this.currentDuration = e.value;
  }

  forward() {
    let myAudio: HTMLMediaElement | null = this.getPlayer();
    let currentTime = Math.round(myAudio.currentTime) + 10;
    myAudio.currentTime = currentTime;
    this.currentDuration = currentTime;
  }

  rewind() {
    let myAudio: HTMLMediaElement | null = this.getPlayer();
    let currentTime = Math.round(myAudio.currentTime) - 10;
    myAudio.currentTime = currentTime;
    this.currentDuration = currentTime;
  }

  drop(event: CdkDragDrop<Track[]>) {
    if (event.previousIndex === this.currentTrackIndex) this.currentTrackIndex = event.currentIndex;
    else if (event.previousIndex < this.currentTrackIndex && event.currentIndex >= this.currentTrackIndex)
      --this.currentTrackIndex;
    else if (event.previousIndex >= this.currentTrackIndex && event.currentIndex <= this.currentTrackIndex)
      ++this.currentTrackIndex;
    moveItemInArray(this.currentPlaylist, event.previousIndex, event.currentIndex);
  }

  delete(index: number) {
    this.currentPlaylist.splice(index, 1);
  }

  setFullScreen() {
    this.fullScreen = !this.fullScreen;
    fullScreenContoller(this);
  }

  onFullScreen(event: any) {
    if (!this.document.fullScreen && !this.document.webkitIsFullScreen && !this.document.mozFullScreen && !this.document.msFullscreenElement) {
      event.fullScreen = false;
      event.lock = false;
    }
    else event.fullScreen = true;
  }

  ngAfterContentChecked() {
    this.changeDetectionRef.detectChanges();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    clearTimeout(this.timeOut);
    this.textValueSubject.unsubscribe();
    document.removeEventListener('fullscreenchange', () => {
    });
    document.removeEventListener('webkitfullscreenchange', () => {
    });
    document.removeEventListener('mozfullscreenchange', () => {
    });
    document.removeEventListener('MSFullscreenChange', () => {
    });
  }
}
