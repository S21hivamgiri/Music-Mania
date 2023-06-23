import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AudioTrackComponent } from './audio-track/audio-track.component';
import { HttpClientModule } from '@angular/common/http';
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { PlaylistComponent } from './playlist/playlist.component';
import { EquilizerComponent } from './equilizer/equilizer.component';
import { NextSongPreviewComponent } from './next-song-preview/next-song-preview.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomepageComponent } from './homepage/homepage.component';
import { PlayingAnimationComponent } from './playing-animation/playing-animation.component';
import { FooterComponent } from './footer/footer.component';
import { AboutComponent } from './about/about.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { WebDeveloperComponent } from './svg/web-developer/web-developer.component';
import { PlayerComponent } from './svg/player/player.component';
import { LoginSvgComponent } from './svg/login-svg/login-svg.component';
import { PresentSongComponent } from './present-song/present-song.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { MatStepperModule } from '@angular/material/stepper';
import { AddNewComponent } from './add-new/add-new.component';


@NgModule({
  declarations: [
    LoginComponent,
    AppComponent,
    AudioTrackComponent,
    PlaylistComponent,
    EquilizerComponent,
    NextSongPreviewComponent,
    NavbarComponent,
    HomepageComponent,
    PlayingAnimationComponent,
    FooterComponent,
    AboutComponent,
    WebDeveloperComponent,
    PlayerComponent,
    LoginSvgComponent,
    PresentSongComponent,
    SignupComponent,
    ForgetPasswordComponent,
    AddNewComponent,
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule, 
    ReactiveFormsModule,
    MatDividerModule,
    MatSliderModule,
    MatSnackBarModule,
    MatListModule,
    BrowserModule,
    DragDropModule,
    AppRoutingModule,
    MatCheckboxModule,
    MatInputModule, 
    MatStepperModule,
    BrowserAnimationsModule,
    MatChipsModule,
    MatMenuModule,
    MatCardModule,
    MatDialogModule, 
    MatSelectModule
  ],
  providers: [HttpClientModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
