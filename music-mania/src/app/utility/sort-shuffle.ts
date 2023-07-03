import { Track } from "../model/track.model";

export function sortSongsByProperty(data: Track[], property: any) {
    return data.sort((a, b) => {
        let nameA = `${a[property as keyof Track]}`.toLowerCase();
        let nameB = `${b[property as keyof Track]}`.toLowerCase();
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
