export function filterSongs(e: any) {
    let searchedValue = e.searchItem.toLowerCase();
    if (!searchedValue) {
        e.searchedPlaylist = e.tracks;
        return;
    }
    let allTracks = [];
    for (let j = 0; j < e.searchedPlaylist.length; ++j) {
        let result = true;
        result = result && !(e.searchedPlaylist[j].title.toLowerCase().startsWith(searchedValue));
        result = result && !(e.searchedPlaylist[j].album.toLowerCase().startsWith(searchedValue));
        result = result && !(e.searchedPlaylist[j].artist.reduce((
            (previousValue:boolean, currentValue:string) => {
                return previousValue || currentValue.toLowerCase().startsWith(searchedValue);
            }
        ), false ));
        if (!result) {
            allTracks.push(e.searchedPlaylist[j]);
        }
    }
    e.searchedPlaylist= allTracks;
    if (!e.searchedPlaylist.length) {
        e.searchedPlaylist = [];
    }
}