export function filterSongs(e: any) {
    let searchedValue = e.searchItem.toLowerCase().trim();
    if (!searchedValue) {
        if (e.tracks.length === e.settings.currentPlaylist.length)
        {
            e.searchedPlaylist = e.settings.currentPlaylist;

        }else
        e.searchedPlaylist = e.tracks;
        return;
    }

    e.searchedPlaylist = e.tracks;
    let allTracks = [];
    for (let j = 0; j < e.searchedPlaylist.length; ++j) {
        let result = true;
        result = result && !(e.searchedPlaylist[j].title.toLowerCase().trim().startsWith(searchedValue));
        result = result && !(e.searchedPlaylist[j].album.toLowerCase().trim().startsWith(searchedValue));
        result = result && !(e.searchedPlaylist[j].artist.reduce((
            (previousValue: boolean, currentValue: string) => {
                return previousValue || currentValue.toLowerCase().trim().startsWith(searchedValue);
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