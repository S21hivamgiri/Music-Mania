import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AudioTrackComponent } from './audio-track/audio-track.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSliderModule } from '@angular/material/slider';
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
import { LoginComponent } from './svg/login/login.component';
import { PresentSongComponent } from './present-song/present-song.component';

@NgModule({
  declarations: [
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
    LoginComponent,
    PresentSongComponent,
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule,
    MatDividerModule,
    MatSliderModule,
    MatListModule,
    BrowserModule,
    DragDropModule,
    AppRoutingModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatChipsModule,
    MatMenuModule,
    MatCardModule,
    MatDialogModule
  ],
  providers: [HttpClientModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
