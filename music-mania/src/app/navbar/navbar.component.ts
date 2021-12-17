import { AfterContentChecked, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router, RouterEvent, Event } from '@angular/router';
import { Track } from '../model/track.model';
import { TrackStore } from '../services/track-store';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { User } from '../model/user.model';
import { AuthService } from '../services/auth.service';
import { filter } from 'rxjs/operators';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterContentChecked {
  @Input() isPlaying: boolean = false;
  @Input() displayTitle: boolean = true;
  @Input() isBackGroundVisible?: boolean = true;
  currentSong?: Track;
  user?: User;
  constructor(readonly authService: AuthService, readonly router: Router, private changeDetectionRef: ChangeDetectorRef, readonly trackStore: TrackStore, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.trackStore.currentSong.subscribe((data) => {
      this.currentSong = data;
    });
  }

  getInitials(): string {
    return this.user?.initials || '?';
  }

  openLoginDialog() {
    const dialogRef = this.dialog.open(LoginComponent, {
      hasBackdrop: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.user = result;
    });
  }

  openSignUpDialog() {
    const dialogRef = this.dialog.open(SignupComponent, {
      hasBackdrop: false
    });
    dialogRef.afterClosed().subscribe(result => {
      this.openLoginDialog();
    });
  }

  ngAfterContentChecked() {
    this.authService.getCurrentUserDetails().subscribe((userData?: User) => {
      this.user = userData;
    });
    this.changeDetectionRef.detectChanges();
  }
}
