import { SPACE, F11, ENTER, LEFT_ARROW, RIGHT_ARROW, R, S, P, N, SHIFT, UP_ARROW, L } from '@angular/cdk/keycodes';
import { Component, ViewChild, OnInit, ChangeDetectorRef, ElementRef, AfterContentChecked, OnDestroy, Inject, HostListener } from '@angular/core';
import { TrackStore } from '../services/track-store';
import { Track } from '../model/track.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { environment } from '../environments/environment';
import { DOCUMENT } from '@angular/common';
import { MatSidenav } from '@angular/material/sidenav';
import { fullScreenContoller } from '../controller/full-screen-contoller';
import { setTextColorOnHeader } from '../controller/set-text-colour-controller';
import { getCurrentTimeInFormat, getDurationInFormat } from '../controller/time-controller';
import { filterSongs } from '../controller/filter-song-controller';
import { shuffleAllSongs, sortSongsByTitle } from '../controller/sort-shuffle-controller';

@Component({
  selector: 'app-audio-track',
  templateUrl: './audio-track.component.html',
  styleUrls: ['./audio-track.component.scss']
})
export class AudioTrackComponent implements OnInit, AfterContentChecked, OnDestroy {
  @HostListener('document:keydown', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode === SPACE || event.keyCode === ENTER) {
      this.playAudio();
    }
    else if (event.keyCode === F11) {
      this.setFullScreen();
    }
    else if (event.keyCode === S) {
      this.setShuffle();
    }
    else if (event.keyCode === LEFT_ARROW) {
      this.rewind();
    }
    else if (event.keyCode === RIGHT_ARROW) {
      this.forward();
    }
    else if (event.keyCode === R) {
      this.loop = !this.loop;
    }
    else if (event.keyCode === P) {
      this.prevAudio();
    }
    else if (event.keyCode === N) {
      this.nextAudio();
    }
    else if (event.keyCode === L) {
      this.sidenav?.toggle();
    }
  }
  
  @ViewChild('sidenav') sidenav?: MatSidenav;
  @ViewChild('searchInput') searchTextInput?: ElementRef;

  tracks: Track[] = [];
  finalTracks: Track[] = [];
  isSearch = false;
  elem: any;
  interval: any;
  timeOut: any;
  
  audioStatus = false;
  audioSource = "";
  duration = 1;
  searchItem = '';
  shuffle = true;
  fullScreen = false;
  currentDuration = 0;
  currentTrackIndex = 0;
  muted = false;
  volume = 1;
  loop = false;

  constructor(private trackStore: TrackStore, readonly changeDetectionRef: ChangeDetectorRef, readonly sideNav: ElementRef, @Inject(DOCUMENT) private document: any) { }

  ngOnInit() {
    this.elem = document.documentElement;
    
    this.trackStore.loadAllTracks().subscribe((data) => {
      this.tracks = data;
      this.filterSong();
      this.setAudioPlayer();
    });

    this.interval = setInterval(() => {
      this.getDuration();
      this.getCurrentTime();
    }, 500);

    document.addEventListener('fullscreenchange', () => { this.onFullScreen(this) });
    document.addEventListener('webkitfullscreenchange', () => { this.onFullScreen(this) });
    document.addEventListener('mozfullscreenchange', () => { this.onFullScreen(this) });
    document.addEventListener('MSFullscreenChange', () => { this.onFullScreen(this) });
  }

  setAudioPlayer() {
    this.audioSource = `${environment.apiAddress}track/stream/${this.finalTracks[this.currentTrackIndex]._id}`;
    let myAudio: HTMLMediaElement | null = this.getPlayer();
    myAudio.src = this.audioSource;
    myAudio.onended = () => {this.nextAudio();}
    this.getPicture();
    this.settextColor();
  }

  setSearch() {
    this.isSearch = !this.isSearch;
    this.timeOut = setTimeout(() => {
      this.searchTextInput?.nativeElement.focus();
    }, 1)
  }

  getPicture() {
    return this.tracks.length ?
      `${environment.apiAddress}track/image/${this.finalTracks[this.currentTrackIndex]?.picture}` : '/assets/music-image.jpg';
  }

  getThumbNailSrc(title?: string) {
    return this.tracks.length && title ? `${environment.apiAddress}track/thumbnail/${title}.png` : '/assets/music-thumbnail.png';
  }

  sortAndShuffleSongs() {
    let removedSong = this.finalTracks.splice(this.currentTrackIndex, 1);
    let allTracks = sortSongsByTitle(this.finalTracks);
    if (this.shuffle) {
      shuffleAllSongs(allTracks);
    }
    allTracks.splice(this.currentTrackIndex, 0, removedSong[0]);
    this.finalTracks = allTracks;
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

  getDuration() {
    getDurationInFormat(this);
  }

  getCurrentTime() {
    getCurrentTimeInFormat(this);
  }

  setShuffle() {
    this.shuffle = !this.shuffle;
    this.sortAndShuffleSongs();
  }

  getCurrentSong() {
    return this.finalTracks[this.currentTrackIndex];
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

  sliderOnChange() {
    let myAudio: HTMLMediaElement | null = this.getPlayer();
    myAudio.volume = this.volume;
  }

  prevAudio() {
    this.audioStatus = !this.audioStatus;
    --this.currentTrackIndex;
    this.setAudioPlayer();
    this.playAudio();
  }

  setCurrentIndex(i: number) {
    this.audioStatus = false;
    this.currentTrackIndex = i;
    this.setAudioPlayer();
    this.playAudio();
  }

  nextAudio() {
    this.audioStatus = !this.audioStatus;
    if (this.loop) this.currentTrackIndex;
    else {
      if (this.currentTrackIndex < this.finalTracks.length - 1) ++this.currentTrackIndex;
      else this.currentTrackIndex = 0;
    }
    this.setAudioPlayer();
    this.playAudio();
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
    moveItemInArray(this.finalTracks, event.previousIndex, event.currentIndex);
  }

  delete(index: number) {
    this.finalTracks.splice(index, 1);
  }

  setFullScreen() {
    this.fullScreen = !this.fullScreen;
    fullScreenContoller(this);
  }

  onFullScreen(event: any) {
    if (!this.document.fullScreen && !this.document.webkitIsFullScreen && !this.document.mozFullScreen && !this.document.msFullscreenElement)
      event.fullScreen = false;
    else event.fullScreen = true;
  }

  ngAfterContentChecked() {
    this.changeDetectionRef.detectChanges();
  }

  ngOnDestroy() {
    this.interval.clearInterval();
    clearTimeout(this.timeOut);
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
