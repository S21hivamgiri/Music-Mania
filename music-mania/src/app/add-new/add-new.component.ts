import { Component, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  displayAdd = true;
  audioFormGroup: FormGroup;
  pictureFormGroup: FormGroup;
  colorFormGroup: FormGroup;
  dataFormGroup: FormGroup;
  file?: File;
  pictureUrl?: any;
  pictureFile?: File;
  picture = "";
  image = false;
  track?: Track;
  constructor(private trackStore: TrackStore,
    private _formBuilder: FormBuilder,
    @Optional() public dialogRef: MatDialogRef<AddNewComponent>) {
    this.audioFormGroup = this._formBuilder.group({
    });

    this.pictureFormGroup = this._formBuilder.group({
    });

    this.dataFormGroup = this._formBuilder.group({
      album: ['', [Validators.required]],
      artist: new FormArray([]),
      title: ['', [Validators.required]],
    });

    this.colorFormGroup = this._formBuilder.group({
      backgroundColor: ['#EDEDED', [Validators.required, Validators.pattern('^#(?:[0-9a-fA-F]{3}){1,2}$')]],
      textColor: ['#000000', [Validators.required, Validators.pattern('^#(?:[0-9a-fA-F]{3}){1,2}$')]],
    });
  }

  handleFileDrop(event: Event) {
    this.file = (event?.target as HTMLInputElement)?.files?.[0];
    event.stopPropagation();
  }

  handlePictureDrop(event: Event) {
    this.pictureFile = (event?.target as HTMLInputElement)?.files?.[0];

    const readURL = (file?: File) => {
      return new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = e => res(e.target?.result);
        reader.onerror = e => rej(e);
        reader.readAsDataURL(file as Blob);
      });
    };

    const preview = async () => {
      this.pictureUrl = await readURL(this.pictureFile);
    };
    preview()
    event.stopPropagation();
  }


  removeFile() {
    this.file = undefined;
  }

  removePictureFile() {
    this.pictureFile = undefined;
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
        this.dataFormGroup.patchValue({ 'title': data.title });
        this.dataFormGroup.patchValue({ 'album': data.album });
        this.track.artist.forEach((art) => {
          const control = new FormControl(art);
          (<FormArray>this.dataFormGroup.get('artist')).push(control);
        });
      });
    }
  }

  deleteFormArray(i:number){
    (<FormArray>this.dataFormGroup.get('artist')).removeAt(i);
  }

  addFormArray() {
    const control = new FormControl('');
    (<FormArray>this.dataFormGroup.get('artist')).push(control);
  }

  getControls() {
    return (this.dataFormGroup.get('artist') as FormArray).controls;
  }

  sendPicture() {
    if (this.pictureFile) {
      this.trackStore.uploadNewPicture(this.pictureFile!, this.track?._id).subscribe(
        (data) => {
          this.track!.picture = ((data.body) as { [picture: string]: string })?.picture as string;
        });
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
          let obj: { [key: string]: string } = {};

          obj[source] = res.sRGBHex;
          this.colorFormGroup.patchValue(obj);
          this.image = false;
        })
    }, 10)
  }

  setKeyDown(event: Event) {
    event.stopPropagation();
    setTimeout(() => {
      (event.target as HTMLInputElement)?.focus();
  },10);
}

  submitData() { 
    let artistData= this.dataFormGroup.get('artist')?.value.flatMap((element:string) => {
      if(element)return element;
      return [];
    });
   const finalData:Track= {
     _id: this.track!._id,
     album: this.dataFormGroup.get('album')?.value,
     artist: artistData,
     picture: this.track!.picture,
     title: this.dataFormGroup.get('title')?.value,
     backgroundColor: this.colorFormGroup.get('backgroundColor')?.value,
     textColor: this.colorFormGroup.get('textColor')?.value,
    }
    this.trackStore.updateTrack(finalData).subscribe(()=>{
      this.dialogRef.close();
    })
  }
}
