import { SPACE, F11, LEFT_ARROW, RIGHT_ARROW, R, S, P, N, L, Z, F, M, UP_ARROW, DOWN_ARROW, X, C, Q } from '@angular/cdk/keycodes';
import { Component, ViewChild, OnInit, ChangeDetectorRef, ElementRef, AfterContentChecked, OnDestroy, Inject, HostListener } from '@angular/core';
import { TrackStore } from '../../services/track-store';
import { Track } from '../../model/track.model';
import { environment } from '../../../environments/environment';
import { DOCUMENT } from '@angular/common';
import { MatSidenav } from '@angular/material/sidenav';
import { fullScreenContoller } from '../../utility/full-screen';
import { setTextColorOnHeader } from '../../utility/set-text-colour';
import { getCurrentTimeInFormat, getDurationInFormat, getFormattedTime } from '../../utility/time';
import { shuffleAllSongs, sortSongsByProperty } from '../../utility/sort-shuffle';
import { Title } from '@angular/platform-browser';
import { PlaylistComponent } from '../../playlist/playlist/playlist.component';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DEFAULT_SETTING, DEFAULT_TRACK } from 'src/app/common/constants';

@Component({
  selector: 'app-audio-track',
  templateUrl: './audio-track.component.html',
  styleUrls: ['./audio-track.component.scss']
})
export class AudioTrackComponent implements OnInit, AfterContentChecked, OnDestroy {
  @ViewChild('sidenav') sidenav?: MatSidenav;
  @ViewChild('playlist') playlist?: PlaylistComponent;


  private readonly destroy = new Subject<void>();
  tracks: Track[] = [];
  interval?: ReturnType<typeof setTimeout>;
  searchItem = '';
  currentSong = DEFAULT_TRACK;
  settings = DEFAULT_SETTING;

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
      else if (event.keyCode === Z) {
        this.settings.lock || this.onSideNavToggle();
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

  constructor(
    private titleService: Title,
    private trackStore: TrackStore,
    readonly changeDetectionRef: ChangeDetectorRef,
    readonly authService: AuthService,
    readonly sideNav: ElementRef,
    public breakpointObserver: BreakpointObserver,
    @Inject(DOCUMENT) private document: any) { }

  ngOnInit() {
    combineLatest([this.trackStore.currentSong, this.trackStore.settings]).pipe(takeUntil(this.destroy)).subscribe(
      ([currentSong, settings]) => {
        this.currentSong = currentSong;
        this.settings = settings;
      });

    this.trackStore.loadAllTracks().pipe(take(1)).subscribe((data) => {
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

    let myAudio: HTMLMediaElement | null = this.getPlayer();
    myAudio.onplay = () => {
      myAudio?.play();
      this.settings.audioStatus = true;
    }
    myAudio.onpause = () => {
      myAudio?.pause();
      this.settings.audioStatus = false;
    }

    document.addEventListener('fullscreenchange', () => { this.onFullScreen(this) });
    document.addEventListener('webkitfullscreenchange', () => { this.onFullScreen(this) });
    document.addEventListener('mozfullscreenchange', () => { this.onFullScreen(this) });
    document.addEventListener('MSFullscreenChange', () => { this.onFullScreen(this) });
  }

  onSideNavToggle() {
    this.sidenav?.toggle();
    if (this.sidenav?.close) {
      this.settings.isSearch = false;
    }
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
    this.titleService.setTitle(this.currentSong.title + ' | MusicMania');
    if (this.currentSong._id) {
      this.setFavicon(this.currentSong._id);
      let myAudio: HTMLMediaElement | null = this.getPlayer();
      let audioSource = `${environment.streamAddress}songs/${this.currentSong._id}`;
      myAudio.src = audioSource;
    }
    this.getPicture();
    this.settextColor();
  }

  setFavicon(id: string) {
    this.document.getElementById('favicon').setAttribute('href', `${environment.streamAddress}images/thumbnail/${id}.png`);
    this.document.getElementById('shortcut-favicon').setAttribute('href', `${environment.streamAddress}images/thumbnail/${id}.png`);
  }

  setSearchBar(searchText?: string) {
    this.sidenav?.open();
    this.searchItem = searchText || '';
    this.settings.isSearch = true;
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

  favourite() {

  }

  getPicture() {
    return this.tracks.length ?
      `${environment.streamAddress}images/album/${this.currentSong.picture}` : '/assets/music-image.jpg';
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

  prevAudio(data: number) {
    this.settings.currentDuration = 0;
    if (data > 10 || data == 0) {
      this.settings.audioStatus = !this.settings.audioStatus;
      if (this.settings.loop) this.settings.currentTrackIndex;
      else {
        if (this.settings.currentTrackIndex === 0) this.settings.currentTrackIndex = this.settings.currentPlaylist.length - 1;
        else --this.settings.currentTrackIndex;
      }
    } else {
      this.settings.audioStatus = !this.settings.audioStatus
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
    this.destroy.next();
    this.destroy.complete();
    this.document.getElementById('favicon').setAttribute('href', 'assets/music-mania-logo-favicon.png');
    this.document.getElementById('shortcut-favicon').setAttribute('href', 'assets/music-mania-logo-favicon.png');
    if (this.interval) clearInterval(this.interval!);
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
