import { Track } from "./track.model";

export interface Settings {
    isSearch: boolean;
    lock: boolean;
    sort: string;
    audioStatus: boolean;
    duration: number;
    currentDuration: number;
    shuffle: boolean;
    fullScreen: boolean;
    currentTrackIndex: number;
    muted: boolean;
    volume: number;
    currentPlaylist: Track[];
    loop: boolean;
}