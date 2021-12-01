export function fullScreenContoller(e:any){
    if (e.fullScreen) {
        if (e.elem.requestFullscreen) {
            e.elem.requestFullscreen();
        } else if (e.elem.mozRequestFullScreen) {
            /* Firefox */
            e.elem.mozRequestFullScreen();
        } else if (e.elem.webkitRequestFullscreen) {
            /* Chrome, Safari and Opera */
            e.elem.webkitRequestFullscreen();
        } else if (e.elem.msRequestFullscreen) {
            /* IE/Edge */
            e.elem.msRequestFullscreen();
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