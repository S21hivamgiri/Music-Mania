import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrackStore } from '../services/track-store';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  constructor(readonly router: Router, private trackStore: TrackStore) { trackStore.loadAllTracks().subscribe(); }

  ngOnInit(): void {
  }

}
