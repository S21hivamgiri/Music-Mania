import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AudioTrackComponent } from './audio-track/audio-track.component';
import { HomepageComponent } from './homepage/homepage.component';

const routes: Routes = [
  {
    path: "", component: HomepageComponent,
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
