import { Component, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { Track } from '../model/track.model';
import { TrackStore } from '../services/track-store';

declare var window: any;

@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.component.html',
  styleUrls: ['./add-new.component.scss']
})
export class AddNewComponent {
  displayAdd=true;
  audioFormGroup: FormGroup;
  colorFormGroup: FormGroup;
  dataFormGroup: FormGroup;
  file?: File;
  picture = "";
  image = false;
  track?: Track;
  constructor(private trackStore: TrackStore, private _formBuilder: FormBuilder, @Optional() public dialogRef: MatDialogRef<AddNewComponent>) {
    this.audioFormGroup = this._formBuilder.group({
    });

    this.dataFormGroup = this._formBuilder.group({
    });

    this.colorFormGroup = this._formBuilder.group({
      backgroundColor: ['#EDEDED', [Validators.required]],
      textColor: ['#000000', [Validators.required]],
    });
  }

  handleFileDrop(event: Event) {
    this.file = (event?.target as HTMLInputElement)?.files?.[0];
    event.stopPropagation();
  }

  removeFile() {
    this.file = undefined;;
  }

  sendSong() {
    if (this.file) {
      this.trackStore.uploadNewTrack(this.file!).subscribe((res) => {
        let data = <Track>(res.body);
        this.track = {
          _id: data?._id || "",
          album: data?.album || "",
          artist: data.artist || [],
          picture: data.picture || "",
          title: data.title || "",
          backgroundColor: data.backgroundColor || "#FFFFFF",
          textColor: data.textColor || "#000000"
        }
      })
    }
  }

  isImagePickingAvailable() {
    return window.EyeDropper
  }

  getPicture(picture?: string) {
    return picture ?
      `${environment.streamAddress}images/album/${picture}` : '/assets/music-image.jpg';
  }

  pickFromImage(source: string) {
    this.image = true;
    setTimeout(() => {
      const eyeDropper = new window.EyeDropper()
      eyeDropper.open()
        .then((res: any) => {
          let obj:{[key:string]:string} = {};

          obj[source] = res.sRGBHex ;
          this.colorFormGroup.patchValue(obj);
          this.image=false;
        })
    }, 10)
  }

  submitData() { }
}
