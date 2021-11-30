import { Component, ViewChild, OnInit, ChangeDetectorRef, ElementRef , AfterContentChecked, OnDestroy, Inject } from '@angular/core';
import { TrackStore } from '../services/track-store';
import { Track } from '../model/track.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { environment } from '../environments/environment';
import { DOCUMENT } from '@angular/common';
import { InvokeMethodExpr } from '@angular/compiler';

@Component({
  selector: 'app-audio-track',
  templateUrl: './audio-track.component.html',
  styleUrls: ['./audio-track.component.scss']
})
export class AudioTrackComponent implements OnInit, AfterContentChecked, OnDestroy {
  
  @ViewChild('sidenav') sidenav: any;
  
  tracks: Track[] = [];
  isSearch=false;
  audioSource = "";
  duration = 1;
  searchItem ='';
  shuffle = true;
  elem:any;
  fullScreen = false;
  currentDuration = 0;
  currentTrackIndex = 0;
  muted = false;
  audioStatus = false;
  volume = 1;
  loop = false;
  interval: any;

  constructor(private trackStore: TrackStore, readonly changeDetectionRef: ChangeDetectorRef, readonly sideNav: ElementRef, @Inject(DOCUMENT) private document: any) { }

  ngOnInit() {
    this.elem = document.documentElement;
    this.trackStore.loadAllTracks().subscribe((data) => {
      this.tracks = data;
      this.sortSongs();
      this.setAudioPlayer();
    });
    this.interval = setInterval(() => {
      this.getDuration();
      this.getCurrentTime();
    }, 500);
  }

  setAudioPlayer() {
    this.audioSource = `${environment.apiAddress}track/stream/${this.tracks[this.currentTrackIndex]._id}`;
    let myAudio: HTMLMediaElement | null = this.getPlayer();
    myAudio.src = this.audioSource;
    myAudio.onended = () => {
      this.nextAudio();
    }
    this.getPicture();
    this.settextColor();

  }

  getPicture() {
    return this.tracks.length ? 
    `${environment.apiAddress}track/image/${this.tracks[this.currentTrackIndex]?.picture}`:'';
  }

  getThumbNailSrc(i: number) {
    return this.tracks.length ? `${environment.apiAddress}track/thumbnail/${this.tracks[i]?.title}.png`:'';

  }

  sortSongs() {
    let removedSong = this.tracks.splice(this.currentTrackIndex, 1)
    let allTracks = this.tracks.sort((a, b) => {
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
      let currentIndex = this.tracks.length-1, randomIndex;

      // While there remain elements to shuffle...
      while (currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex--);
          // And swap it with the current element.
          [allTracks[currentIndex], allTracks[randomIndex]] = [
            allTracks[randomIndex], allTracks[currentIndex]];
        
      }
    }
    allTracks.splice(this.currentTrackIndex, 0, removedSong[0]);
    this.tracks=allTracks;
  }


  settextColor() {
    const textColor = this.getCurrentSong()?.textColor;
    const textCss = `.mat-accent .mat-slider-track-fill, .mat-accent .mat-slider-thumb, .mat-accent .mat-slider-thumb-label {
                      background: ${textColor}!important;
                    }
                    .mat-form-field.mat-focused .mat-form-field-ripple {
                      background: ${textColor}!important;
                    }`
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

  setFullScreen() {
    this.fullScreen = !this.fullScreen;
    if(this.fullScreen){
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
  }
    else{
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
    return this.tracks[this.currentTrackIndex];
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
      if (this.currentTrackIndex < this.tracks.length - 1)
        ++this.currentTrackIndex;
      else this.currentTrackIndex = 0;
    this.setAudioPlayer();
    this.playAudio();
  }

  ngAfterContentChecked() {
    this.changeDetectionRef.detectChanges();
  }

  onInputChange(e: any) {
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

  ngOnDestroy() {
    this.interval.clearInterval();

  }

  drop(event: CdkDragDrop<Track[]>) {
    if (event.previousIndex === this.currentTrackIndex) this.currentTrackIndex = event.currentIndex;
    else if (event.previousIndex < this.currentTrackIndex && event.currentIndex >= this.currentTrackIndex)
      --this.currentTrackIndex;
    else if (event.previousIndex >= this.currentTrackIndex && event.currentIndex <= this.currentTrackIndex)
      ++this.currentTrackIndex;
    moveItemInArray(this.tracks, event.previousIndex, event.currentIndex); 
  }


  delete(index: number) {
    this.tracks.splice(index, 1);
  }
}
