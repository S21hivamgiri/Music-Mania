import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DEFAULT_SETTING, DEFAULT_TRACK } from 'src/app/common/constants';

@Component({
  selector: 'app-playlist-tool',
  templateUrl: './playlist-tool.component.html',
  styleUrls: ['./playlist-tool.component.scss']
})
export class PlaylistToolComponent {
  @Input() textColor = DEFAULT_TRACK.textColor;
  @Input() settings = DEFAULT_SETTING;

  @Output() closePlayList = new EventEmitter<void>();
  @Output() searchSong = new EventEmitter<void>();
  @Output() sortSong = new EventEmitter<string>();
}
