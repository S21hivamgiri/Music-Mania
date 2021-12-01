export function filterSongs(e:any){
    e.finalTracks = [];
    let searchedValue = e.searchItem.toLowerCase();
    if (!searchedValue) {
        e.finalTracks = e.tracks;
        return;
    }
    for (let j = 0; j < e.tracks.length; ++j) {
        let result = !e.finalTracks.includes(e.tracks[j]);
        result = result && !(e.tracks[j].title.toLowerCase().startsWith(searchedValue));
        result = result && !(e.tracks[j].album.toLowerCase().startsWith(searchedValue));
        for (let data in e.tracks[j].artist) { result = result && !(data.toLowerCase().startsWith(searchedValue)); };
        if (!result) {
            e.finalTracks.push(e.tracks[j]);
        }
    }

    if (!e.finalTracks.length) {
        e.finalTracks = [];
    }
    e.sortSongs();

}