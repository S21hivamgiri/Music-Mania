import { Track } from "../model/track.model";

export function sortSongsByTitle(data:Track[]) {
   return data.sort((a, b) => {
        let nameA = a.title.toLowerCase();
        let nameB = b.title.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });
}

export function shuffleAllSongs(data: Track[]) {
    let currentIndex = data.length - 1, randomIndex;
    while (currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex--);
        [data[currentIndex], data[randomIndex]] = [data[randomIndex], data[currentIndex]];
    }
}
