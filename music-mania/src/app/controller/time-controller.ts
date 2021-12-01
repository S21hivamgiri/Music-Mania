function getTimeFormat(a: number) {
    let temp = Math.floor(a)
    return temp < 10 ? `0${temp}` : temp
}

export function getCurrentTimeInFormat(e: any) {
    let myAudio: HTMLMediaElement | null = e.getPlayer();
    e.currentDuration = Math.floor(myAudio?.currentTime || 0);
    let currentTime = `${getTimeFormat(e.currentDuration / 60)}:${getTimeFormat(e.currentDuration % 60)}`;
    let durationDom = document.getElementById('duration-content');
    durationDom!.innerHTML = currentTime;
    return currentTime;
}

export function getDurationInFormat(e: any) {
    let myAudio: HTMLMediaElement | null = e.getPlayer();
    e.duration = Math.floor(myAudio?.duration || 0);
    let durationDom = document.getElementById('total-duration-content');
    let finaDuration = e.duration ? `${getTimeFormat(e.duration / 60)}:${getTimeFormat(e.duration % 60)}` : '00:00'
    durationDom!.innerHTML = finaDuration;
}

