import { PlaylistComponent } from "../playlist/playlist/playlist.component";

export function filterSongs(e: PlaylistComponent) {
    let searchedValue = e.searchItem.toLowerCase().trim();
    if (!searchedValue) {
        e.searchedPlaylist = e.tracks;
        return;
    }
    e.searchedPlaylist = e.tracks;
    let allTracks = [];
    for (let j = 0; j < e.searchedPlaylist.length; ++j) {
        let result = true;
        result = result && !(e.searchedPlaylist[j].title.toLowerCase().trim().includes(searchedValue));
        result = result && !(e.searchedPlaylist[j].album.toLowerCase().trim().includes(searchedValue));
        result = result && !(e.searchedPlaylist[j].artist.reduce((
            (previousValue: boolean, currentValue: string) => {
                return previousValue || currentValue.toLowerCase().trim().includes(searchedValue);
            }
        ), false));
        if (!result) {
            allTracks.push(e.searchedPlaylist[j]);
        }
    }
    e.searchedPlaylist = allTracks;
    if (!e.searchedPlaylist.length) {
        e.searchedPlaylist = [];
    }
}