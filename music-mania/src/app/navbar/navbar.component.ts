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

    window.addEventListener('scroll', (e: Event)=> {
      if (document.body.scrollTop > 100 ||
        document.documentElement.scrollTop > 100){
        this.displayTitle=false;
    }else{
        this.displayTitle = true;
    }
    }, true);

  }
}
