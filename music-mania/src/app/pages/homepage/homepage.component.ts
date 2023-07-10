import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { AuthService } from '../../services/auth.service';
import { TrackStore } from '../../services/track-store';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  displayTitle = true;
  isBackGroundVisible = true;
  @ViewChild('navBar') navBarInput?: NavbarComponent;

  constructor(readonly router: Router, readonly trackStore: TrackStore, readonly authService: AuthService) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }
}
