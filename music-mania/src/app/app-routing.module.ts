import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AudioTrackComponent } from './audio-track/audio-track.component';
import { HomepageComponent } from './homepage/homepage.component';

const routes: Routes = [
  {
    path: "", component: HomepageComponent,
  },
  {
    path: "about", component: AboutComponent,
  },
  {
    path: "track", component: AudioTrackComponent,
  },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
