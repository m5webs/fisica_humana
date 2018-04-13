/*
    BANNER MOUSE MOVEMENT
    Initialize this script by calling
    bannerInit() function in init.js
*/


function bannerInit() {
    let banners = document.getElementsByClassName("banner_img"),
        i = -1;

    while(++i < banners.length) {
        banners[i].addEventListener("mousemove", mMove);
        banners[i].addEventListener("click", mClick);
        updBanner(banners[i]);
    }
}

function mMove(e) {
    let y = e.clientY - e.target.offsetTop + window.scrollY,
        x = e.clientX - e.target.offsetLeft,
        h = Number(e.target.clientHeight),
        w = Number(e.target.clientWidth);
    
    e.target.style.backgroundPositionY = (y / h) * 100 + "%";
    e.target.style.backgroundPositionX = (x / w) * 100 + "%";
}

function mClick(e) {
    updBanner(e.target);
}

function updBanner(target) {
    let mode = +target.getAttribute("mode"),
        maxMode = +target.getAttribute("maxMode"),
        heights = target.getAttribute("heights").split(", ");
    mode++;
    mode %= maxMode;
    target.setAttribute("mode", mode);

    switch(mode) {
        case 0:
            target.style.backgroundSize = "cover";
            target.style.backgroundAttachment = "local";
            break;
        case 1:
            target.removeEventListener("mousemove", mMove);
            target.style.backgroundSize = "cover";
            target.style.backgroundAttachment = "fixed";
            break;
        case 2:
            target.addEventListener("mousemove", mMove);
            target.style.backgroundSize = "auto";
            target.style.backgroundAttachment = "local";
            break;
        case 3:
            target.style.backgroundSize = "cover";
            target.style.backgroundAttachment = "fixed";
            break;
    }
    target.style.height = heights[mode];
}