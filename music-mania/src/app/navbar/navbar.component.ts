import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Track } from '../model/track.model';
import { TrackStore } from '../services/track-store';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() isPlaying: boolean = false;
  @Input() displayTitle: boolean = true;
  @Input() isBackGroundVisible?: boolean = true;
  currentSong?: Track;

  constructor(readonly router: Router, private trackStore: TrackStore) { }

  ngOnInit(): void {

    this.trackStore.currentSong.subscribe((data) => {
      this.currentSong = data;
    });

  }
}
