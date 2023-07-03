import { Component, Input, OnInit } from '@angular/core';
import { Track } from '../model/track.model';
import { TrackStore } from '../services/track-store';

@Component({
  selector: 'app-equilizer',
  templateUrl: './equilizer.component.html',
  styleUrls: ['./equilizer.component.scss']
})
export class EquilizerComponent implements OnInit {
  currentSong?: Track;
  constructor(readonly trackStore: TrackStore) { }

  ngOnInit(): void {
    this.trackStore.currentSong.subscribe((data) => {
      this.currentSong = data;
    });
  }
}
