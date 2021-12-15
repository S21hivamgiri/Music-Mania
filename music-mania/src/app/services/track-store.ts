import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Track } from '../model/track.model';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Settings } from '../model/settings.model';


@Injectable({
    providedIn: 'root'
})
export class TrackStore {

    private subject = new BehaviorSubject<Track[]>([]);

    tracks$: Observable<Track[]> = this.subject.asObservable();

    constructor(private http: HttpClient) { }

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
    });
    // saveTrack(trackId: string, changes: Partial<Track>): Observable<any> {

    //     const tracks = this.subject.getValue();

    //     const index = tracks.findIndex(track => track._id == trackId);

    //     const newTrack: Track = {
    //         ...tracks[index],
    //         ...changes
    //     };

    //     const newTracks: Track[] = tracks.slice(0);

    //     newTracks[index] = newTrack;

    //     this.subject.next(newTracks);

    //     return this.http.put(`/api/track/${trackId}`, changes)
    //         .pipe(
    //             catchError(err => {
    //                 const message = "Could not save track";
    //                 console.log(message, err);
    //                 return throwError(err);
    //             }),
    //             shareReplay()
    //         );
    // }

}