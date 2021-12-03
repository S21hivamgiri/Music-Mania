import { Component, Input, OnInit } from '@angular/core';
import { Track } from '../model/track.model';

@Component({
  selector: 'app-equilizer',
  templateUrl: './equilizer.component.html',
  styleUrls: ['./equilizer.component.scss']
})
export class EquilizerComponent implements OnInit {
  @Input() currentSong?:Track;
  constructor() { }

  ngOnInit(): void {
  }

}
