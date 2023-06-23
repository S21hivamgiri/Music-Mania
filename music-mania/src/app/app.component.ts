import { Component, OnDestroy } from '@angular/core';
import { TrackStore } from './services/track-store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'Music Mania';

  constructor(private trackStore: TrackStore) { }

  ngOnDestroy(): void {
    this.trackStore.applicationClosed$.next();
    this.trackStore.applicationClosed$.complete(); 
  }
}
