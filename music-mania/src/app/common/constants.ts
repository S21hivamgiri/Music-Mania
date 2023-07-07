import { Settings } from "../model/settings.model"
import { Track } from "../model/track.model"

export const countryList = [
    { name: 'India', code: 'in' },
    { name: 'USA', code: 'us' },
    { name: 'UK', code: 'gb' },
    { name: 'Nepal', code: 'np' },
    { name: 'Japan', code: 'jp' },
    { name: 'Bhutan', code: 'bt' },
]

export const DEFAULT_TRACK: Track = {
    backgroundColor: '',
    _id: '',
    textColor: '',
    title: '',
    artist: [],
    album: '',
    picture: '',
};

export const DEFAULT_SETTING: Settings = {
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
};