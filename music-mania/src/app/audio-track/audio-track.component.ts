import { SPACE, F11, LEFT_ARROW, RIGHT_ARROW, R, S, P, N, L, Z, F, M, UP_ARROW, DOWN_ARROW, X, C, Q } from '@angular/cdk/keycodes';
import { Component, ViewChild, OnInit, ChangeDetectorRef, ElementRef, AfterContentChecked, OnDestroy, Inject, HostListener } from '@angular/core';
import { TrackStore } from '../services/track-store';
import { Track } from '../model/track.model';
import { environment } from '../environments/environment';
import { DOCUMENT } from '@angular/common';
import { MatSidenav } from '@angular/material/sidenav';
import { fullScreenContoller } from '../controller/full-screen-contoller';
import { setTextColorOnHeader } from '../controller/set-text-colour-controller';
import { getCurrentTimeInFormat, getDurationInFormat, getFormattedTime } from '../controller/time-controller';
import { shuffleAllSongs, sortSongsByProperty } from '../controller/sort-shuffle-controller';
import { Title } from '@angular/platform-browser';
import { PlaylistComponent } from '../playlist/playlist.component';
import { Settings } from '../model/settings.model';

@Component({
  selector: 'app-audio-track',
  templateUrl: './audio-track.component.html',
  styleUrls: ['./audio-track.component.scss']
})
export class AudioTrackComponent implements OnInit, AfterContentChecked, OnDestroy {
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode === P) {
      this.settings.lock || this.prevAudio(20);
    }
    else if (event.keyCode === Q) {
      this.prevAudio(5);
    }
    else if (event.keyCode === N) {
      this.settings.lock || this.nextAudio();
    }
    else
    if (event.keyCode === SPACE) {
      this.playAudio();
    }
    else if (event.keyCode === F11 || event.keyCode === F) {
      this.settings.lock || this.setFullScreen();
    }
    else if (event.keyCode === X) {
      this.settings.lock || this.setShuffle();
    }
    else if (event.keyCode === LEFT_ARROW) {
      this.settings.lock || this.rewind();
    }
    else if (event.keyCode === RIGHT_ARROW) {
      this.settings.lock || this.forward();
    }
    else if (event.keyCode === UP_ARROW) {
      if (this.settings.volume < 1) this.settings.volume = this.settings.volume + 0.1;
      this.setVolume();
    }
    else if (event.keyCode === DOWN_ARROW) {
      if (this.settings.volume > 0) this.settings.volume = this.settings.volume - 0.1;
      this.setVolume();
    }
    else if (event.keyCode === R) {
      this.settings.lock || (this.settings.loop = !this.settings.loop);
    }
    else  if (event.keyCode === Z) {
      this.settings.lock || this.sidenav?.toggle();
    }
    else if (event.keyCode === L) {
      this.setLock();
    }
    else if (event.keyCode === S) {
      this.settings.lock || this.setSearchBar('');
    }
    else if (event.keyCode === M) {
      this.muteAudio();
    }
    else if (event.keyCode === C) {
      this.settings.lock || (this.sidenav?.open() &&
        (this.playlist!.searchedPlaylist = this.settings.currentPlaylist) &&
        (this.settings.isSearch = false) && (this.searchItem = ''));
    }
    event.preventDefault();
  }

  @ViewChild('sidenav') sidenav?: MatSidenav;
  @ViewChild('playlist') playlist?: PlaylistComponent;

  tracks: Track[] = [];
  elem: any;
  interval: any;
  searchItem: string = '';
  currentSong!: Track;
  settings!: Settings;

  constructor(private titleService: Title, private trackStore: TrackStore, readonly changeDetectionRef: ChangeDetectorRef, readonly sideNav: ElementRef, @Inject(DOCUMENT) private document: any) { }

  ngOnInit() {
    this.elem = document.documentElement;
    this.trackStore.currentSong.subscribe((data) => {
      this.currentSong = data;
    });

    this.trackStore.settings.subscribe((data) => {
      this.settings = data;
    });

    this.trackStore.loadAllTracks().subscribe((data) => {
      this.tracks = data;
      this.settings.currentPlaylist = this.tracks;
      this.sortAndShuffleSongs();
      this.setAudioPlayer();
      if (this.settings.audioStatus) {
        this.settings.audioStatus = !this.settings.audioStatus;
        this.playAudio();
      }
    });

    this.interval = setInterval(() => {
      this.getDuration();
      this.getCurrentTime();
      this.trackStore.settings.next(this.settings);
    }, 500);

    document.addEventListener('fullscreenchange', () => { this.onFullScreen(this) });
    document.addEventListener('webkitfullscreenchange', () => { this.onFullScreen(this) });
    document.addEventListener('mozfullscreenchange', () => { this.onFullScreen(this) });
    document.addEventListener('MSFullscreenChange', () => { this.onFullScreen(this) });
  }

  setAndPlayAudio() {
    this.setAudioPlayer();
    this.playAudio();
  }

  playAudio() {
    let myAudio: HTMLMediaElement | null = this.getPlayer();
    if (this.settings.audioStatus) {
      myAudio.pause();
      this.settings.audioStatus = false;
    }
    else {
      myAudio.play();
      this.settings.audioStatus = true;
    }
    myAudio.currentTime = this.settings.currentDuration;
    this.trackStore.settings.next(this.settings);
  }

  setAudioPlayer() {
    this.trackStore.currentSong.next(this.settings.currentPlaylist[this.settings.currentTrackIndex]);
    this.titleService.setTitle('MusicMania | ' + this.currentSong.title);
    let audioSource = `${environment.apiAddress}track/stream/${this.currentSong._id}`;
    let myAudio: HTMLMediaElement | null = this.getPlayer();
    myAudio.src = audioSource;
    myAudio.onended = () => { this.nextAudio(); }
    this.getPicture();
    this.settextColor();
  }

  setSearchBar(searchText?: string) {
    this.sidenav?.open();
    this.settings.isSearch = true;
    this.searchItem = searchText || '';
    this.playlist?.setSearchBarFocus();
    this.trackStore.settings.next(this.settings);
  }

  setLock() {
    this.searchItem = '';
    this.settings.isSearch = false;
    this.sidenav?.close();
    this.settings.lock = !this.settings.lock;
    this.settings.fullScreen = !this.settings.lock;
    this.setFullScreen();
    this.trackStore.settings.next(this.settings);
  }

  getPicture() {
    return this.tracks.length ?
      `${environment.apiAddress}track/image/${this.currentSong?.picture}` : '/assets/music-image.jpg';
  }

  sortAndShuffleSongs() {
    let allTracks;
    allTracks = sortSongsByProperty(this.settings.currentPlaylist, this.settings.sort);
    if (this.settings.shuffle) shuffleAllSongs(allTracks);
    this.settings.currentPlaylist = allTracks;
    if (this.currentSong._id)
      this.settings.currentTrackIndex = this.settings.currentPlaylist.findIndex(i => i._id === this.currentSong._id);
    this.trackStore.settings.next(this.settings);
  }

  settextColor() {
    setTextColorOnHeader(this);
  }

  getPlayer() {
    return <HTMLVideoElement>document.getElementsByTagName('audio')[0];
  }

  getDuration() {
    getDurationInFormat(this, true);
    this.trackStore.settings.next(this.settings);
  }

  getCurrentTime() {
    getCurrentTimeInFormat(this, true);
    this.trackStore.settings.next(this.settings);
  }

  formatTimeLabel(value: number) {
    return getFormattedTime(value);
  }

  setShuffle() {
    this.settings.shuffle = !this.settings.shuffle;
    this.sortAndShuffleSongs();
  }

  muteAudio() {
    let myAudio: HTMLMediaElement | null = this.getPlayer();
    if (this.settings.muted) {
      this.settings.muted = false;
      myAudio.volume = this.settings.volume;
    }
    else {
      this.settings.muted = true;
      myAudio.volume = 0;
    }
  }

  setVolume() {
    let myAudio: HTMLMediaElement | null = this.getPlayer();
    myAudio.volume = this.settings.volume;
  }

  prevAudio(data:number) {
    this.settings.currentDuration = 0;
    if (data > 10 || data==0)  {
      this.settings.audioStatus = !this.settings.audioStatus;
      if (this.settings.loop) this.settings.currentTrackIndex;
      else {
        if (this.settings.currentTrackIndex === 0) this.settings.currentTrackIndex = this.settings.currentPlaylist.length - 1;
        else --this.settings.currentTrackIndex;
      }
    }else{
      this.settings.audioStatus=!this.settings.audioStatus
    }
    this.setAndPlayAudio();
  }

  nextAudio() {
    this.settings.currentDuration = 0;
    this.settings.audioStatus = !this.settings.audioStatus;
    if (this.settings.loop) this.settings.currentTrackIndex;
    else {
      if (this.settings.currentTrackIndex < this.settings.currentPlaylist.length - 1) ++this.settings.currentTrackIndex;
      else this.settings.currentTrackIndex = 0;
    }
    this.setAndPlayAudio();
  }

  onPlayerInputChange(e: any) {
    let myAudio: HTMLMediaElement | null = this.getPlayer();
    myAudio.currentTime = e.value;
    this.settings.currentDuration = e.value;
  }

  forward() {
    let myAudio: HTMLMediaElement | null = this.getPlayer();
    let currentTime = Math.round(myAudio.currentTime) + 10;
    myAudio.currentTime = currentTime;
    this.settings.currentDuration = currentTime;
  }

  rewind() {
    let myAudio: HTMLMediaElement | null = this.getPlayer();
    let currentTime = Math.round(myAudio.currentTime) - 10;
    myAudio.currentTime = currentTime;
    this.settings.currentDuration = currentTime;
  }

  setFullScreen() {
    this.settings.fullScreen = !this.settings.fullScreen;
    fullScreenContoller(this);
  }

  onFullScreen(event: any) {
    if (!this.document.fullScreen && !this.document.webkitIsFullScreen && !this.document.mozFullScreen && !this.document.msFullscreenElement) {
      event.settings.fullScreen = false;
      event.settings.lock = false;
    }
    else event.settings.fullScreen = true;
  }

  ngAfterContentChecked() {
    this.changeDetectionRef.detectChanges();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    let sliderClass = document.getElementsByTagName('style')[0];
    if ((sliderClass.classList.contains('audio-tag'))) {
      sliderClass.innerText = sliderClass.innerText.replace(sliderClass.innerText, '');
    }
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
