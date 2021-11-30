import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AudioTrackComponent } from './audio-track/audio-track.component';

const routes: Routes = [
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
