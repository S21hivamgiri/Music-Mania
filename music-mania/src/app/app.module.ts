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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { PlaylistComponent } from './playlist/playlist.component';
import { EquilizerComponent } from './equilizer/equilizer.component';
import { NextSongPreviewComponent } from './next-song-preview/next-song-preview.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomepageComponent } from './homepage/homepage.component';
import { PlayingAnimationComponent } from './playing-animation/playing-animation.component';
import { FooterComponent } from './footer/footer.component';
import { AboutComponent } from './about/about.component';
import { MatCardModule } from '@angular/material/card';
import { WebDeveloperComponent } from './svg/web-developer/web-developer.component';
import { PlayerComponent } from './svg/player/player.component';
import { LoginSvgComponent } from './svg/login-svg/login-svg.component';
import { PresentSongComponent } from './present-song/present-song.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { MatStepperModule } from '@angular/material/stepper'; 
import { LayoutModule } from '@angular/cdk/layout';
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
    LayoutModule,
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
