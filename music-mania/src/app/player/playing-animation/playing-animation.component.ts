import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-playing-animation',
  templateUrl: './playing-animation.component.html',
  styleUrls: ['./playing-animation.component.scss']
})
export class PlayingAnimationComponent implements OnInit {
  @Input() audioStatus = false;
  @Input() color?: string = '#000000'

  constructor() { }

  ngOnInit(): void {
  }

}
