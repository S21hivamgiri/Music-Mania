export function fullScreenContoller(e: any) {
    if (e.settings.fullScreen) {
        if (e.document.documentElement.requestFullscreen) {
            e.document.documentElement.requestFullscreen();
        } else if (e.document.documentElement.mozRequestFullScreen) {
            /* Firefox */
            e.document.documentElement.mozRequestFullScreen();
        } else if (e.document.documentElement.webkitRequestFullscreen) {
            /* Chrome, Safari and Opera */
            e.document.documentElement.webkitRequestFullscreen();
        } else if (e.document.documentElement.msRequestFullscreen) {
            /* IE/Edge */
            e.document.documentElement.msRequestFullscreen();
        }
    }
    else {
        if (e.document.exitFullscreen) {
            e.document.exitFullscreen();
        } else if (e.document.mozCancelFullScreen) {
            /* Firefox */
            e.document.mozCancelFullScreen();
        } else if (e.document.webkitExitFullscreen) {
            /* Chrome, Safari and Opera */
            e.document.webkitExitFullscreen();
        } else if (e.document.msExitFullscreen) {
            /* IE/Edge */
            e.document.msExitFullscreen();
        }
    }
}