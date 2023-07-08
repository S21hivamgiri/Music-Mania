import { AfterContentChecked, ChangeDetectorRef, Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Track } from '../../model/track.model';
import { TrackStore } from '../../services/track-store';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../../authentication/login/login.component';
import { User } from '../../model/user.model';
import { AuthService } from '../../services/auth.service';
import { SignupComponent } from '../../authentication/signup/signup.component';
import { ForgetPasswordComponent } from '../../authentication/forget-password/forget-password.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { AddNewComponent } from '../../track/add-new/add-new.component';
import { DEFAULT_TRACK } from 'src/app/common/constants';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  @ViewChild('contextMenuTrigger', { read: MatMenuTrigger }) contextMenuTrigger?: MatMenuTrigger;
  @Input() isPlaying = false;
  @Input() displayTitle = true;
  @Input() isBackGroundVisible = true;

  private readonly destroy = new Subject<void>();
  currentSong: Track = DEFAULT_TRACK;
  user?: User;

  constructor(readonly authService: AuthService, readonly router: Router, readonly trackStore: TrackStore, public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.trackStore.currentSong.pipe(takeUntil(this.destroy)).subscribe((data: Track) => {
      this.currentSong = data;
    });
    this.authService.getCurrentUserDetails().pipe(takeUntil(this.destroy)).subscribe((userData?: User) => {
      this.user = userData;
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

  forgetPasswordDialog(email?: string) {
    const dialogRef = this.dialog.open(ForgetPasswordComponent, {
      data: { email: email },
      hasBackdrop: false
    });
    dialogRef.afterClosed().subscribe(() => {
      this.openLoginDialog();
    });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
