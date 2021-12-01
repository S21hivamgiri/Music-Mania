import { Component, ViewChild, OnInit, ChangeDetectorRef, ElementRef, AfterContentChecked, OnDestroy, Inject, HostListener } from '@angular/core';
import { TrackStore } from '../services/track-store';
import { Track } from '../model/track.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { environment } from '../environments/environment';
import { DOCUMENT } from '@angular/common';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-audio-track',
  templateUrl: './audio-track.component.html',
  styleUrls: ['./audio-track.component.scss']
})
export class AudioTrackComponent implements OnInit, AfterContentChecked, OnDestroy {
  @ViewChild('sidenav') sidenav?: MatSidenav;
  @ViewChild('searchInput') searchTextInput?: ElementRef;
  tracks: Track[] = [];
  finalTracks: Track[] = [];
  isSearch = false;
  audioSource = "";
  duration = 1;
  searchItem = '';
  shuffle = true;
  elem: any;
  fullScreen = false;
  currentDuration = 0;
  currentTrackIndex = 0;
  muted = false;
  audioStatus = false;
  volume = 1;
  loop = false;
  interval: any;
  timeOut: any;

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
  }

  setAudioPlayer() {
    this.audioSource = `${environment.apiAddress}track/stream/${this.finalTracks[this.currentTrackIndex]._id}`;
    let myAudio: HTMLMediaElement | null = this.getPlayer();
    myAudio.src = this.audioSource;
    myAudio.onended = () => {
      this.nextAudio();
    }
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

  sortSongs() {
    let removedSong = this.finalTracks.splice(this.currentTrackIndex, 1);
    let allTracks = this.finalTracks.sort((a, b) => {
      let nameA = a.title.toLowerCase();
      let nameB = b.title.toLowerCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });;
    if (this.shuffle) {
      let currentIndex = this.finalTracks.length - 1, randomIndex;
      while (currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex--);
        [allTracks[currentIndex], allTracks[randomIndex]] = [
          allTracks[randomIndex], allTracks[currentIndex]];
      }
    }
    allTracks.splice(this.currentTrackIndex, 0, removedSong[0]);
    this.finalTracks = allTracks;
  }


  filterSong() {
    this.finalTracks = [];
    let searchedValue = this.searchItem.toLowerCase();
    if (!searchedValue) {
      this.finalTracks = this.tracks;
      return;
    }
    for (let j = 0; j < this.tracks.length; ++j) {
      let result = !this.finalTracks.includes(this.tracks[j]);
      result = result && !(this.tracks[j].title.toLowerCase().startsWith(searchedValue));
      result = result && !(this.tracks[j].album.toLowerCase().startsWith(searchedValue));
      for (let data in this.tracks[j].artist) { result = result && !(data.toLowerCase().startsWith(searchedValue)); };
      if (!result) {
        this.finalTracks.push(this.tracks[j]);
      }
    }

    if (!this.finalTracks.length) {
      this.finalTracks = [];
    }
    this.sortSongs();
  }

  settextColor() {
    const textColor = this.getCurrentSong()?.textColor;
    const textCss = `.mat-accent .mat-slider-track-fill, .mat-accent .mat-slider-thumb, .mat-accent .mat-slider-thumb-label {
                      background: ${textColor}!important;
                    }
                    .mat-form-field.mat-focused .mat-form-field-ripple {
                      background: ${textColor}!important;
                    }
                    .mat-form-field-label{
                      color: ${textColor}!important;
                    }
                    `
    let sliderClass = document.getElementsByTagName('style')[0];
    if (!(sliderClass.classList.contains('audio-tag'))) {
      sliderClass.classList.add('audio-tag');
      sliderClass.append(textCss);
    } else {
      sliderClass.innerText = sliderClass.innerText.replace(sliderClass.innerText, textCss);
    }
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

  getTimeFormat(a: number) {
    let temp = Math.floor(a)
    return temp < 10 ? `0${temp}` : temp
  }

  getDuration() {
    let myAudio: HTMLMediaElement | null = this.getPlayer();
    this.duration = Math.floor(myAudio.duration || 0);
    let durationDom = document.getElementById('total-duration-content');
    let finaDuration = this.duration ? (this.getTimeFormat(this.duration / 60)) + ":" + (this.getTimeFormat(this.duration % 60)) : '00:00'
    durationDom!.innerHTML = finaDuration;
  }

  getCurrentTime() {
    let myAudio: HTMLMediaElement | null = this.getPlayer();
    this.currentDuration = Math.floor(myAudio.currentTime || 0);
    let currentTime = (this.getTimeFormat(this.currentDuration / 60)) + ":" + (this.getTimeFormat(this.currentDuration % 60));
    let durationDom = document.getElementById('duration-content');
    durationDom!.innerHTML = currentTime;
    return currentTime;
  }

  setLoop() {
    if (this.loop) {
      this.loop = false;
    }
    else {
      this.loop = true;
    }
  }


  setShuffle() {
    if (this.shuffle) {
      this.shuffle = false;
    }
    else {
      this.shuffle = true;
    }
    this.sortSongs();
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
    if (this.loop) {
      this.currentTrackIndex;
    } else
      if (this.currentTrackIndex < this.finalTracks.length - 1)
        ++this.currentTrackIndex;
      else this.currentTrackIndex = 0;
    this.setAudioPlayer();
    this.playAudio();
  }

  ngAfterContentChecked() {
    this.changeDetectionRef.detectChanges();
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

    if (this.fullScreen) {
      if (this.elem.requestFullscreen) {
        this.elem.requestFullscreen();
      } else if (this.elem.mozRequestFullScreen) {
        /* Firefox */
        this.elem.mozRequestFullScreen();
      } else if (this.elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.elem.webkitRequestFullscreen();
      } else if (this.elem.msRequestFullscreen) {
        /* IE/Edge */
        this.elem.msRequestFullscreen();
      }
      document.addEventListener('fullscreenchange', () => { this.onFullScreenExit(this) });
      document.addEventListener('webkitfullscreenchange', () => { this.onFullScreenExit(this) });
      document.addEventListener('mozfullscreenchange', () => { this.onFullScreenExit(this) });
      document.addEventListener('MSFullscreenChange', () => { this.onFullScreenExit(this) });
    }
    else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

  onFullScreenExit(event: any) {
    if (!this.document.fullScreen &&!this.document.webkitIsFullScreen && !this.document.mozFullScreen && !this.document.msFullscreenElement) {
      event.fullScreen = false;
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

  ngOnDestroy() {
    this.interval.clearInterval();
    clearTimeout(this.timeOut);
    this.onFullScreenExit(this);
  }
}
