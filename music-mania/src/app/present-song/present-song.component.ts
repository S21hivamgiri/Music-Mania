import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getCurrentTimeInFormat } from '../controller/time-controller';
import { environment } from '../environments/environment';
import { Settings } from '../model/settings.model';
import { Track } from '../model/track.model';
import { TrackStore } from '../services/track-store';

@Component({
  selector: 'app-present-song',
  templateUrl: './present-song.component.html',
  styleUrls: ['./present-song.component.scss']
})
export class PresentSongComponent implements OnInit {

  settings!: Settings;
  currentSong!:Track;
  constructor(private trackStore: TrackStore, readonly router:Router) { }

  ngOnInit(): void {
    this.trackStore.currentSong.subscribe((data) => {
      this.currentSong = data;
    });
    this.trackStore.settings.subscribe((data) => {
      this.settings = data;
    });
  }

  getThumbNailSrc(title?: string) {
    return this.settings?.currentPlaylist.length && title ? `${environment.apiAddress}track/thumbnail/${title}.png` : '/assets/music-thumbnail.png';
  }

  playSong() {
    let myAudio: HTMLMediaElement | null = this.getPlayer();
    if (this.settings.audioStatus) {
      myAudio.pause();
      this.settings.audioStatus = false;
    }
    else {
      myAudio.play();
      this.settings.audioStatus = true;
    }
    this.getCurrentTime();
  }

  getCurrentTime() {
    getCurrentTimeInFormat(this, false);
    this.trackStore.settings.next(this.settings);
  }

  getPlayer() {
    return <HTMLVideoElement>document.getElementsByTagName('audio')[0];
  }

  setAudioPlayer() {
    this.trackStore.currentSong.next(this.settings.currentPlaylist[this.settings.currentTrackIndex]);
    let audioSource = `${environment.apiAddress}track/stream/${this.currentSong._id}`;
    let myAudio: HTMLMediaElement | null = this.getPlayer();
    myAudio.src = audioSource;
    myAudio.onended = () => { this.nextAudio(); }
  }

  prevAudio() {
    this.settings.currentDuration = 0;
    this.settings.audioStatus = !this.settings.audioStatus;
    if (this.settings.loop) this.settings.currentTrackIndex;
    else {
      if (this.settings.currentTrackIndex === 0) this.settings.currentTrackIndex = this.settings.currentPlaylist.length - 1;
      else --this.settings.currentTrackIndex;
    }
    this.setAudioPlayer();
    this.playSong();
  }

  nextAudio() {
    this.settings.currentDuration = 0;
    this.settings.audioStatus = !this.settings.audioStatus;
    if (this.settings.loop) this.settings.currentTrackIndex;
    else {
      if (this.settings.currentTrackIndex < this.settings.currentPlaylist.length - 1) ++this.settings.currentTrackIndex;
      else this.settings.currentTrackIndex = 0;
    }
    this.setAudioPlayer();
    this.playSong();
  }
}
