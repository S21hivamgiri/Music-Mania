import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TrackStore } from '../../services/track-store';
import { DEFAULT_SETTING, DEFAULT_TRACK } from 'src/app/common/constants';

@Component({
  selector: 'app-next-song-preview',
  templateUrl: './next-song-preview.component.html',
  styleUrls: ['./next-song-preview.component.scss']
})
export class NextSongPreviewComponent implements OnInit {
  @Output() nextAudioEvent = new EventEmitter();
  nextSong = DEFAULT_TRACK;
  settings = DEFAULT_SETTING;

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

  getThumbNailSrc(_id: string) {
    return this.settings.currentPlaylist.length && _id ? `${environment.streamAddress}images/thumbnail/${_id}.png` : '/assets/music-thumbnail.png';
  }

  nextAudio() {
    this.nextAudioEvent.emit();
  }
}
