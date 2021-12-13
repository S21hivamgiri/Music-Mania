import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from '../environments/environment';
import { Settings } from '../model/settings.model';
import { Track } from '../model/track.model';
import { TrackStore } from '../services/track-store';

@Component({
  selector: 'app-next-song-preview',
  templateUrl: './next-song-preview.component.html',
  styleUrls: ['./next-song-preview.component.scss']
})
export class NextSongPreviewComponent implements OnInit {
  @Output() nextAudioEvent = new EventEmitter();
  nextSong?: Track;
  settings!: Settings;

  constructor(private trackStore: TrackStore) { }

  ngOnInit(): void {
    this.trackStore.settings.subscribe((data) => {
      this.settings = data;
      this.nextSong = this.getNextSong();
    });
  }

  getNextSong() {
    if (this.settings.loop) return this.settings.currentPlaylist[this.settings.currentTrackIndex];
    else {
      if (this.settings.currentTrackIndex < this.settings.currentPlaylist.length - 1)
        return this.settings.currentPlaylist[this.settings.currentTrackIndex + 1];
      else return this.settings.currentPlaylist[0];
    }
  }

  getThumbNailSrc(title?: string) {
    return this.settings?.currentPlaylist.length && title ? `${environment.apiAddress}track/thumbnail/${title}.png` : '/assets/music-thumbnail.png';
  }

  nextAudio() {
    this.nextAudioEvent.emit();
  }
}
