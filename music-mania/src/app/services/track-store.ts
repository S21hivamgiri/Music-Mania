import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Track } from '../model/track.model';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Settings } from '../model/settings.model';
import { AuthService } from './auth.service';
import { User } from '../model/user.model';


@Injectable({
    providedIn: 'root'
})
export class TrackStore {
    private subject = new BehaviorSubject<Track[]>([]);
    tracks$: Observable<Track[]> = this.subject.asObservable();

    constructor(private http: HttpClient, private authService: AuthService) { }

    getFavourite(trackId: string) {
        this.authService.getCurrentUserDetails().subscribe((data: User | undefined) => {
            let id = data?.userId;
            this.http.put(environment.apiAddress + `/playlist/like/${id}`, { track: trackId })
                .pipe(
                    catchError(err => {
                        console.log("Could not save track", err);
                        return throwError(err);
                    }),
                );
        });
    }

    removeFavourite(trackId: string) {
        this.authService.getCurrentUserDetails().subscribe((data: User | undefined) => {
            let id = data?.userId;
            this.http.put(environment.apiAddress + `/playlist/unlike/${id}`, { track: trackId })
                .pipe(
                    catchError(err => {
                        console.log("Could not save track", err);
                        return throwError(err);
                    }),
                );
        });
    }

    loadAllTracks() {
        const loadTracks$ = this.http.get<Track[]>(environment.apiAddress + 'track/')
            .pipe(
                map(response => response),
                catchError(err => {
                    const message = "Could not load tracks";
                    return throwError(err);
                }),
                tap(tracks => this.subject.next(tracks))
            );
        return loadTracks$;
    }

    currentSong: BehaviorSubject<Track> = new BehaviorSubject(<Track>{
        backgroundColor: '',
        _id: '',
        textColor: '',
        title: '',
        artist: [],
        album: '',
        picture: ''
    });

    settings: BehaviorSubject<Settings> = new BehaviorSubject(<Settings>{
        isSearch: false,
        lock: false,
        sort: 'title',
        audioStatus: false,
        duration: 1,
        currentDuration: 0,
        shuffle: true,
        fullScreen: false,
        currentTrackIndex: 0,
        muted: false,
        currentPlaylist: [],
        volume: 1,
        loop: false,
        liked: []
    });

    updateTrack(obj: Track) {
        let id = obj._id;
        const tracks = this.subject.getValue();
        let flag = -1;
        tracks.some((data, i) => {
            let res = (data._id === id);
            if (res) flag = i;
            return res;
        });

        if (flag === -1) tracks.push(obj);
        else tracks[flag] = { ...tracks[flag], ...obj }

        this.subject.next(tracks);

        return this.http.put(environment.apiAddress + `/track/update/${id}`, obj)
            .pipe(
                catchError(err => {
                    const message = "Could not save track";
                    console.log(message, err);
                    return throwError(err);
                }),
                shareReplay()
            );
    }

    uploadNewTrack(file: File): Observable<HttpResponse<Object>> {
        let formData = new FormData();
        formData.append('music', file);
        return this.http.post(environment.apiAddress + 'track/add/', formData, {
            reportProgress: true,
            observe: 'response'
        });
    }

    uploadNewPicture(file: File, id?: string): Observable<HttpResponse<Object>> {
        let formData = new FormData();
        formData.append('picture', file);
        return this.http.post(environment.apiAddress + 'track/replace-picture/' + id, formData, {
            reportProgress: true,
            observe: 'response'
        });
    }
}