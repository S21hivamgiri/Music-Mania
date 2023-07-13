import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DEFAULT_SETTING, DEFAULT_TRACK } from 'src/app/common/constants';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-list-tile',
  templateUrl: './list-tile.component.html',
  styleUrls: ['./list-tile.component.scss']
})
export class ListTileComponent {
  @Input() isCurrentPlaylist = false;
  @Input() currentSong = DEFAULT_TRACK;
  @Input() track = DEFAULT_TRACK;
  @Input() settings = DEFAULT_SETTING;

  get isCurrenSongSelected(){
    return this.currentSong._id === this.track._id
  }
  
  getThumbNailSrc(id: string) {
    return this.settings.currentPlaylist.length && id ? `${environment.streamAddress}images/thumbnail/${id}.png` : '/assets/music-thumbnail.png';
  }
}
