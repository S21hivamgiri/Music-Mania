import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Track } from '../model/track.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() isPlaying: boolean = false;
  @Input() displayTitle: boolean = false;
  @Input() currentSong?: Track;
  constructor(readonly router: Router) { }

  ngOnInit(): void {
    window.addEventListener('scroll', (e: Event) => {

      if (!this.isPlaying) {
        if (document.body.scrollTop > 100 ||
          document.documentElement.scrollTop > 100) {
          this.displayTitle = false;
        } else {
          this.displayTitle = true;
        }
      }

      if ((document.body.scrollTop > window.innerHeight * 0.7 && document.body.scrollTop < window.innerHeight) ||
        (document.documentElement.scrollTop > window.innerHeight * 0.7 && document.documentElement.scrollTop < window.innerHeight)) {
        window.scrollTo({ top: window.innerHeight });
      } else {
        if ((document.body.scrollTop > window.innerHeight * 1.7 && document.body.scrollTop < 2 * window.innerHeight) ||
          (document.documentElement.scrollTop > window.innerHeight * 1.7 && document.documentElement.scrollTop < 2 * window.innerHeight)) {
          window.scrollTo({ top: window.innerHeight * 2 });
        }
      }
    }, true);

  }
}
