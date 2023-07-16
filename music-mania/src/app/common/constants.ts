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
    backgroundColor: '#fcf9eb',
    _id: '',
    textColor: '#000000',
    title: 'Love Yet to Come',
    artist: ['Shivam Kumar Giri'],
    album: '',
    picture: '',
};

export const DEFAULT_SETTING: Settings = {
    isSearching: false,
    lock: false,
    sort: 'title',
    audioStatus: false,
    duration: 1,
    currentDuration: 0,
    shuffle: true,
    fullScreen: false,
    currentTrackIndex: 0,
    muted: false,
    currentPlaylist: [DEFAULT_TRACK],
    volume: 1,
    loop: false,
};

export const DEFAULT_SORT_INDEX: { [key: string]: boolean } = {
    "#": false,
    "A": false,
    "B": false,
    "C": false,
    "D": false,
    "E": false,
    "F": false,
    "G": false,
    "H": false,
    "I": false,
    "J": false,
    "K": false,
    "L": false,
    "M": false,
    "N": false,
    "O": false,
    "P": false,
    "Q": false,
    "R": false,
    "S": false,
    "T": false,
    "U": false,
    "V": false,
    "W": false,
    "X": false,
    "Y": false,
    "Z": false,
};

export const HOTLIST_ITEMS: string[] = ['Arijit Singh', 'I Hate Luv Storys', 'Nazm Nazm', 'K.K.', 'Ajab Prem Ki Ghazab Kahani', 'Mann Mera', 'Sab Tera',]