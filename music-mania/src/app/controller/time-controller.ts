function getTimeFormat(num: number) {
    let temp = Math.floor(num)
    return temp < 10 ? `0${temp}` : temp
}

export function getFormattedTime(time: number) {
    return `${getTimeFormat(time / 60)}:${getTimeFormat(time % 60)}`
}

export function getCurrentTimeInFormat(e: any) {
    let myAudio: HTMLMediaElement | null = e.getPlayer();
    e.currentDuration = Math.floor(myAudio?.currentTime || 0);
    let currentTime = getFormattedTime(e.currentDuration);
    let durationDom = document.getElementById('duration-content');
    durationDom!.innerHTML = currentTime;
    return currentTime;
}

export function getDurationInFormat(e: any) {
    let myAudio: HTMLMediaElement | null = e.getPlayer();
    e.duration = Math.floor(myAudio?.duration || 0);
    let durationDom = document.getElementById('total-duration-content');
    let finaDuration = e.duration ? getFormattedTime(e.duration) : '00:00'
    durationDom!.innerHTML = finaDuration;
}

