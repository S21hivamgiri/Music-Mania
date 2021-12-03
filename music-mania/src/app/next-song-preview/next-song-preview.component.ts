import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from '../environments/environment';
import { Track } from '../model/track.model';
import { TrackStore } from '../services/track-store';

@Component({
  selector: 'app-next-song-preview',
  templateUrl: './next-song-preview.component.html',
  styleUrls: ['./next-song-preview.component.scss']
})
export class NextSongPreviewComponent implements OnInit {
  @Input() lock=false;
  @Output() nextAudioEvent = new EventEmitter();
  @Input() nextSong?:Track;
  constructor(private trackStore:TrackStore) { }
  tracks:Track[]=[];
  ngOnInit(): void {
    this.trackStore.loadAllTracks().subscribe((data) => {
      this.tracks = data;
  });
}

  getThumbNailSrc(title?: string) {
    return this.tracks.length && title ? `${environment.apiAddress}track/thumbnail/${title}.png` : '/assets/music-thumbnail.png';
  }

  nextAudio(){
    this.nextAudioEvent.emit();
  }

}
