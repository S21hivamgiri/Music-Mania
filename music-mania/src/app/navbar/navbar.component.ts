import { AfterContentChecked, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Track } from '../model/track.model';
import { TrackStore } from '../services/track-store';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { User } from '../model/user.model';
import { AuthService } from '../services/auth.service';
import { SignupComponent } from '../signup/signup.component';
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { AddNewComponent } from '../add-new/add-new.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterContentChecked {
  @Input() isPlaying = false;
  @Input() displayTitle = true;
  @Input() isBackGroundVisible = true;
  @Input() isMobileView = false;
  @ViewChild('contextMenuTrigger', { read: MatMenuTrigger }) contextMenuTrigger?: MatMenuTrigger;

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

  getTitle(): string {
    return `${this.user?.firstName} ${this.user?.lastName}` || 'Please Login';
  }
  
  openAddNewSongDialog() {
    this.dialog.open(AddNewComponent, {
      hasBackdrop: false
    });
  }

  openLoginDialog() {
    const dialogRef = this.dialog.open(LoginComponent, {
      hasBackdrop: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result?.type === 'forget') this.forgetPasswordDialog(result?.email);
      else if (result) this.user = result;
    });
  }

  openSignUpDialog() {
    const dialogRef = this.dialog.open(SignupComponent, {
      hasBackdrop: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') this.openLoginDialog();
    });
  }

  openContextMenu(e: Event) {
    e.stopPropagation();
    this.contextMenuTrigger?.openMenu();
  }

  forgetPasswordDialog(email: string) {
    const dialogRef = this.dialog.open(ForgetPasswordComponent, {
      data: { email: email },
      hasBackdrop: false
    });
    dialogRef.afterClosed().subscribe(() => {
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
