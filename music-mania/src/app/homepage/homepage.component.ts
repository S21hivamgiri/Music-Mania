import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../services/auth.service';
import { TrackStore } from '../services/track-store';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  displayTitle: boolean = true;
  isBackGroundVisible: boolean = true;
  @ViewChild('navBar') navBarInput?: NavbarComponent;

  constructor(readonly router: Router, readonly trackStore: TrackStore, readonly authService: AuthService) { trackStore.loadAllTracks().subscribe(); }

  ngOnInit(): void {
    window.scrollTo(0, 0);

    window.addEventListener('scroll', (e: Event) => {
      if (document.body.scrollTop > 100 ||
        document.documentElement.scrollTop > 100) {
        this.displayTitle = false;
        this.isBackGroundVisible = false;
      } else {
        this.displayTitle = true;
        this.isBackGroundVisible = true;
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
