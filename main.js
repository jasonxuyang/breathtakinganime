import {shows} from './content.js';
// console.log(shows);
// console.log(shows[0].images);
// console.log(typeof shows);

// Init container, body, cursor
const main = document.getElementById('main');
const cursorInner = document.getElementById('cursor_inner');
const cursorOuter = document.getElementById('cursor_outer');
const container = document.getElementById('gallery');
const imgs = document.getElementsByClassName('gallery_img')
const navLeft = document.getElementById('nav_left');
const navRight = document.getElementById('nav_right');

// Init explorer
const explorer = document.getElementById('animation_explorer_container');
const animationDetails = document.getElementById('animation_details');
const animationPlatforms = document.getElementById('animation_platforms');
const audioPlayer = document.getElementById('audio_player');
const audioPlayButton = document.getElementById('play_button');
const audioTimeMarker = document.getElementById('audio_time');
const audioTimeLeftMarker = document.getElementById('audio_time_left');
const audioLoadBar = document.getElementById('audio_load_bar');
const audioProgressBar = document.getElementById('audio_progress_bar');


// Init audio variables
var audioPlaying = 0;

// Init variables to keep track of mouse position
let posInnerX = 0;
let posInnerY = 0;
let posOuterX = 0;
let posOuterY = 0;
let pointerPosX = posOuterX;
let pointerPosY = posOuterY;
let pointerDownTarget = 0;

// Init variables to keep track of mouse sizes
let outerScale, outerScaleUpdate, innerScale, innerScaleUpdate, outerBorder, outerBorderUpdate;
outerScale = .25;
innerScale = 1;
outerBorder = 8;
outerBorderUpdate = outerBorder;
innerScaleUpdate = innerScale;
outerScaleUpdate = outerScale;

// Init press and hold variables
let timerID, counterPct;
let counter = 0;
let holdTarget, holdParent, holdURL
let pressHoldDuration = 40;

// Init variables to keep track of container position
let diffX, diffY;
let sx = 0;
let sy = 0;
let dx = sx;
let dy = sy;

// Init gallery and gallery variables
var gallery = [];
let galleryRows, galleryColumns;

// Populates gallery array with images
function getImgList() {
    shows.forEach(e => {
        for (var k in e.images) {
            gallery.push({
                'showName': e.name,
                'studio': e.studio,
                'imgID' : k,
                'imgURL': e.images[k]
            })
        }
    })
    shuffleArray(gallery);
}

// Randomizes img order
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Calculates rows and columns in gallery
function getGallerySize(a) {
    var isPrime = 0;
    const initialLength = a.length;
    while (isPrime === 0) {
        if (Number.isInteger(Math.sqrt(a.length))) {
            galleryRows = Math.sqrt(a.length);
            galleryColumns = Math.sqrt(a.length);
            isPrime = 1;
            console.log('images removed: ' + (initialLength - a.length));
        } else {
            a.pop();
        }
    }
    console.log('The gallery will have '+ galleryRows + ' rows and ' + galleryColumns + ' columns.');
}

// Populates HTML img gallery with content
function createGallery(){
    var arrayCounter = 0;
    // For each row
    for (var i = 0; i < galleryRows; i++) {
        // Create a new img container
        var newImgContainer = document.createElement('div');
        newImgContainer.classList.add('img_container');
        container.appendChild(newImgContainer);

        // For each column
        for (var j = 0; j < galleryColumns; j++) {
            // Create an img wrapper within the container
            var newImgWrapper = document.createElement('div');
            newImgWrapper.classList.add('img_wrapper');
            newImgContainer.appendChild(newImgWrapper);

            // Add overlay to wrapper
            var newImgOverlay = document.createElement('div');
            newImgOverlay.classList.add('img_overlay');
            newImgWrapper.appendChild(newImgOverlay);

            // Add content to overlay
            var newImgOverlayContent = document.createElement('div');
            newImgOverlayContent.classList.add('img_content');
            newImgOverlay.appendChild(newImgOverlayContent);

            // Add animation studio to overlay content
            var newImgStudio = document.createElement('h3');
            var studioText = document.createTextNode(gallery[arrayCounter].studio);
            newImgStudio.appendChild(studioText);
            newImgOverlayContent.appendChild(newImgStudio);

            // Add animation name to overlay content
            var newImgShowName = document.createElement('h2');
            var showNameText = document.createTextNode(gallery[arrayCounter].showName);
            newImgShowName.appendChild(showNameText);
            newImgOverlayContent.appendChild(newImgShowName);

            // Add img to wrapper
            var newImg = document.createElement('img');
            newImg.classList.add('gallery_img');
            newImg.src = gallery[arrayCounter].imgURL;
            newImg.id = gallery[arrayCounter].imgID;
            newImgWrapper.appendChild(newImg);

            // Iterate counter
            arrayCounter ++;
        }
    }
}

// Gallery Stuff
getImgList();
getGallerySize(gallery);
createGallery();


// Moves element to center of screen
function moveToCenter(e) {
    let imgBounding = e.target.getBoundingClientRect();
    let centerPosX = imgBounding.left + (imgBounding.width / 2);
    let centerPosY = imgBounding.top + (imgBounding.height / 2);
    let windowCenterX = window.innerWidth / 2;
    let windowCenterY = window.innerHeight / 2;
    let centerDiffX = windowCenterX - centerPosX;
    let centerDiffY = windowCenterY - centerPosY;
    sx += centerDiffX;
    sy += centerDiffY;
}

// Inersection Observer Settings
const options = {
    root: document.window,
    rootMargin: '0px',
    threshold: 0
}

// If intersecting, fade img in
function callback (entries, observer) {
    // console.log(observer);
    
    entries.forEach(entry => {
        let imgIntersecting = entry.isIntersecting;
        if (imgIntersecting == true) {
            entry.target.classList.add('visible');
        } else {
            entry.target.classList.remove('visible');
        }
    });
}
let observer = new IntersectionObserver(callback, options);

// Tracking progress of page load
var loadCounter = 0;
function loadProgressIncrementer(e){
    loadCounter ++;
    console.log(loadCounter + ' images have loaded.');
    if (loadCounter === imgs.length) {
        console.log('All images have been loaded.');
    }
}

// Adding event listeners to all the imgs
for (let img of imgs) {
    img.addEventListener('mouseenter', mouseEnter);
    img.addEventListener('mouseleave', mouseLeave);
    img.addEventListener('load', loadProgressIncrementer);
    img.addEventListener('click', moveToCenter);
    observer.observe(img);
}

// Cursor hover animations
function mouseEnter(e) {
    outerScale = 1;
    outerBorder = 2;
    e.target.addEventListener('mousedown', pressingDown);
    e.target.addEventListener("mouseup", notPressingDown);
    e.target.addEventListener("mouseleave", notPressingDown);
}
function mouseLeave(e) {
    outerScale = .25;
    outerBorder = 8;
    e.target.removeEventListener('mousedown', pressingDown);
    e.target.removeEventListener("mouseup", notPressingDown);
    e.target.removeEventListener("mouseleave", notPressingDown);
    cancelAnimationFrame(timerID);
}

// Cursor pressing on img
function pressingDown(e) {
    holdTarget = e;
    holdParent = e.target.parentElement;
    requestAnimationFrame(timer);
    e.preventDefault();
    // console.log("Pressing!");
}

// When not pressing on an img
function notPressingDown(e) {
    // Stop the timer
    cancelAnimationFrame(timerID);
    outerScale = 1;
    outerBorder = 2;
    counter = 0;
    // console.log("Not pressing!");
}

// Timer function for hold animaion
function timer() {
    // console.log("Timer tick! " + counterPct);
    if (counter < pressHoldDuration) {
        counterPct = Math.round((counter / (pressHoldDuration - 1)) * 100) / 100;
        timerID = requestAnimationFrame(timer);
        counter++;
        outerScale = (1 - counterPct) * .5;
    } else {
        // console.log("Press threshold reached!");
        enterExplorer();
    }
}

// Entering animation explorer
function enterExplorer() {
    // console.log("pressHold event fired!");
    holdTarget.target.removeEventListener('click', moveToCenter);
    moveToCenter(holdTarget);
    cursorInner.style.opacity = '0';
    cursorOuter.style.opacity = '0';
    setTimeout(transition, 300);
    setTimeout(redirect, 2000);
}

// Transiioning
function transition() {
    let children = holdParent.children;
    let overlay = children.item(0);
    let img = children.item(1);

    // remove overlay
    overlay.style.opacity = '0';

    // finding persepctive coordinates
    let imgBounding = img.getBoundingClientRect();
    let containerBounding = container.getBoundingClientRect();
    let centerPosX = imgBounding.left + (imgBounding.width / 2); // finding x center of img
    let centerPosY = imgBounding.top + (imgBounding.height / 2); // finding y center of img
    let relativePosLeft = centerPosX - containerBounding.left; // finding relative x pos of img center to container
    let relativePosTop = centerPosY - containerBounding.top; // finding relative y pos of img center to container
    let leftPct = relativePosLeft / containerBounding.width; // calculating x percent for perspective origin
    let topPct = relativePosTop / containerBounding.height; // calculating y percent for perspective origin
    
    // center and translate the img in perspctive
    container.style.perspectiveOrigin = `${leftPct * 100}% ${topPct * 100}%`;
    // img.style.transform = `translateZ(${-5}px)`;
    
    // centering wrapper in persepective
    const containerWrapper = document.getElementById('gallery_wrapper');
    containerWrapper.style.perspectiveOrigin = `${leftPct * 100}% ${topPct * 100}%`;
    
    // translating container in perspective
    container.style.transform = `translateZ(${-.15}vw)`;
    container.style.opacity = `0`;
    container.style.pointerEvents = 'none';

    // transitioning nav
    navLeft.style.opacity = '0';
    navLeft.style.marginTop = '-.25vw'
    navRight.style.opacity = '0';
    navRight.style.marginTop = '-.25vw'
}

// console.log(history.state);

let field = document.getElementById("field");
var htmlContents = document.documentElement.innerHTML;
localStorage.setItem('myBook', JSON.stringify(htmlContents));
localStorage.getItem('myBook');


// function pushState(show) {
//     var state = { selectedShow : show},
//         title = 'Page title',
//         path = '/' + show;
    
//         history.pushState(state, title, path);
// }

// window.addEventListener('popstate', doSomething);


// pushState('home');

function redirect() {
    // pushState('violet_evergarden');
    container.style.visibility = 'hidden';
    explorer.style.visibility = 'visible';
    explorer.style.opacity = '1';
    
    navLeft.style.opacity = '1';
    navLeft.style.marginTop = '0vw'
    navRight.style.opacity = '1';
    navRight.style.marginTop = '0vw'

    cursorInner.style.opacity = '1';
    cursorOuter.style.opacity = '1';

    window.removeEventListener('mousemove', findDifference);
    window.removeEventListener('wheel', scroll);
    // window.addEventListener('mousemove', explorerFindDifference);
    // window.addEventListener('wheel', explorerScroll);
    window.addEventListener('mousemove', checkEdges)
    explorer.addEventListener('mousemove', showAnimationInfo);
    audioPlayButton.addEventListener('click', toggleAudio)
    // audioPlayer.addEventListener('progress', buffering);
    audioPlayer.addEventListener('timeupdate', updateAudioTime);
    
    showAnimationInfo();
    playAudio();
}

// console.log(audioPlayer.buffered);

// function buffering() {
//     console.log(audioPlayer.buffered);
// }

function pad2(number) {
    return (number < 10 ? '0' : '') + number
}

function updateAudioTime() {
    // get audio timestamps
    var audioTime = audioPlayer.currentTime;
    var audioLength = audioPlayer.duration;
    audioTime = Math.floor(audioTime);
    audioLength = Math.floor(audioLength);
    var audioTimeLeft = audioLength - audioTime;

    // convert to minutes and seconds
    var audioTimeMinutes = Math.floor(audioTime / 60);
    var audioTimeSeconds = pad2(audioTime % 60);
    var audioTimeLeftMinutes = Math.floor(audioTimeLeft / 60);
    var audioTimeLeftSeconds = pad2(audioTimeLeft % 60);
    
    // update time markers
    audioTimeMarker.innerHTML = audioTimeMinutes + ':' + audioTimeSeconds;
    audioTimeLeftMarker.innerHTML = audioTimeLeftMinutes + ':' + audioTimeLeftSeconds
    window.requestAnimationFrame(updateAudioProgressBar);
}

function updateAudioProgressBar() {
    audioProgressBar.style.width = `${(audioPlayer.currentTime / audioPlayer.duration) * 80.278}vw`;
    window.requestAnimationFrame(updateAudioProgressBar);
}

function toggleAudio() {
    if (audioPlaying == 1) {
        pauseAudio();
    } else if (audioPlaying == 0) {
        playAudio();
    }
}

function playAudio() {
    audioPlayer.play();
    audioPlaying = 1;
    audioPlayButton.src='/static/icon_pause.svg';
}

function pauseAudio() {
    audioPlayer.pause();
    audioPlaying = 0;
    audioPlayButton.src='/static/icon_play.svg';
}

function checkEdges(e) {
    var x = e.clientX;
    var y = e.clientY;
    let w1 = window.innerWidth * .02;
    let w2 = window.innerWidth * .98;
    let h1 = window.innerHeight * .98;
    let h2 = window.innerHeight * .02;
    if((x>w2 || x<w1) || (y>h1 || y<h2)){
        console.log("We are in the outer area");
        hideAnimationInfo();
        hideCursor();
    } else {
        showCursor();
    }
    // console.log('Mouse position: ' + x + ', ' + y);
    // console.log('x limits: ' + w1 + ', ' + w2 + ' / '+ 'y limits: ' + h1 + ', ' + h2)
}

function showAnimationInfo() {
    animationDetails.style.opacity = '1';
    animationPlatforms.style.opacity = '1';
    animationDetails.style.marginTop = '0vw';
    animationPlatforms.style.marginTop = '0vw';
    clearTimeout(timer);
    timer=setTimeout(hideAnimationInfo, 5000);
}

function hideAnimationInfo() {
    animationDetails.style.opacity = '0';
    animationPlatforms.style.opacity = '0';
    animationDetails.style.marginTop = '-.25vw';
    animationPlatforms.style.marginTop = '-.25vw';
}

function showCursor() {
    cursorInner.style.opacity = '1';
    cursorOuter.style.opacity = '1';
}

function hideCursor() {
    cursorInner.style.opacity = '0';
    cursorOuter.style.opacity = '0';
}

// let explorerDiffX;
// let explorerDiffy;
// let explorerSx = 0;
// let explorerSy = 0;
// let explorerDx = explorerSx;
// let explorerDy = explorerSy;


// function explorerFindDifference(e) {
//     e.preventDefault();
//     // If mouse is pressed
//     if (pointerDownTarget === 1) {
//         explorerDiffX = e.movementX;
//         console.log(explorerDiffX);
//     }
//     explorerMoveNext();
// }

// function explorerMoveNext() {
//     if (explorerDiffX < 1) {
//         explorerSx -= window.innerWidth;
//         console.log(explorerSx);
//     }
// }

// function explorerUpdatePosition() {
//     explorerDx = lerp(explorerDx, explorerSx, 0.08);
//     explorerDy = lerp(explorerDy, explorerSy, 0.08);
//     explorerDx = Math.floor(explorerDx * 100) / 100;
//     explorerDy = Math.floor(explorerDy * 100) / 100;
//     // console.log(dx + ", " + dy);
//     explorer.style.transform = `translate(${explorerDx}px, ${explorerDy}px)`;
// }



// Establishing Event Listeners for navigation and cursor
window.addEventListener('mousemove', initialPointer);
window.addEventListener('mousemove', findPointerPosition);
window.addEventListener('mousedown', onPointerDown)
window.addEventListener('mouseup', onPointerUp);
window.addEventListener('mousemove', findDifference);
window.addEventListener('wheel', scroll);

// Detect if mouse is pressed
function onPointerDown() {
    pointerDownTarget = 1;
    // console.log("down!");
}

// Detect mouse release
function onPointerUp() {
    pointerDownTarget = 0;
    // console.log("up!");
}

// Hide Cursors initially
function initialPointer() {
    cursorInner.style.opacity = 1;
    cursorOuter.style.opacity = 1;
    window.removeEventListener('mousemove', initialPointer);
}

// Find position of cursor relative to window
function findPointerPosition(e) {
    posInnerX = e.clientX - (cursorInner.clientWidth / 2);
    posInnerY = e.clientY - (cursorInner.clientHeight / 2);
    posOuterX = e.clientX - ((cursorOuter.clientWidth + (2 * outerBorder)) / 2);
    posOuterY = e.clientY - ((cursorOuter.clientHeight + (2 * outerBorder)) / 2);

    // console.log("Mouse position: " + posX + ", " + posY);
}

// Update position of pointer
function updatePointerPosition() {
    pointerPosX = lerp(pointerPosX, posOuterX, 0.15);
    pointerPosY = lerp(pointerPosY, posOuterY, 0.15);
    pointerPosX = Math.floor(pointerPosX * 100) / 100;
    pointerPosY = Math.floor(pointerPosY * 100) / 100;

    outerScaleUpdate = lerp(outerScaleUpdate, outerScale, 0.15);
    outerScaleUpdate = Math.floor(outerScaleUpdate * 100) / 100;

    innerScaleUpdate = lerp(innerScaleUpdate, innerScale, 0.15);
    innerScaleUpdate = Math.floor(innerScaleUpdate * 100) / 100;

    outerBorderUpdate = lerp(outerBorderUpdate, outerBorder, 0.15);
    outerBorderUpdate = Math.floor(outerBorderUpdate * 100) / 100;

    cursorInner.style.transform = `translate(${posInnerX}px, ${posInnerY}px) scale(${innerScaleUpdate}`;
    cursorOuter.style.transform = `translate(${pointerPosX}px, ${pointerPosY}px) scale(${outerScaleUpdate}`;
    cursorOuter.style.border = `rgba(255, 255, 255, .75) solid ${outerBorderUpdate}px`;
}

// Find position of container
function findDifference(e) {
    e.preventDefault();
    // If mouse is pressed
    if (pointerDownTarget === 1) {
        // console.log(e.movementX + ", " + e.movementY);
        diffX = e.movementX * 3;
        diffY = e.movementY * 3;
        sx += diffX;
        sy += diffY;
        // console.log(sx + ", " + sy);
    }
}

// On scroll, update position variables
function scroll(e) {
    console.log(e.deltaX + ', ' + e.deltaY);
    sx -= e.deltaX;
    sy -= e.deltaY;
}


// Update position of container
function updatePosition() {
    dx = lerp(dx, sx, 0.08);
    dy = lerp(dy, sy, 0.08);
    dx = Math.floor(dx * 100) / 100;
    dy = Math.floor(dy * 100) / 100;
    // console.log(dx + ", " + dy);
    main.style.transform = `translate(${dx}px, ${dy}px)`;
}

// Establishing scroll limits
function pastLimits() {
    let imgBounding = container.getBoundingClientRect();
    // If  scroll past left limit
    if (imgBounding.left >= 0) {
        diffX =  -imgBounding.left / 8;
        sx += diffX;
    }
    // If  scroll past right limit
    if (imgBounding.right <= window.innerWidth) {
        diffX = (window.innerWidth - imgBounding.right) / 8;
        sx += diffX;
    }
    // If  scroll past top limit
    if (imgBounding.top >= 0) {
        diffY = -imgBounding.top / 8;
        sy += diffY;
    }
    // If  scroll past bottom limit
    if (imgBounding.bottom <= window.innerHeight) {
        diffY = (window.innerHeight - imgBounding.bottom) / 8;
        sy += diffY;
    }
}

// Translating to Start Position (Middle of Gallery)
function startPosition() {
    if (Number.isInteger(gallery.length / 2)) {
        let imgBounding = container.getBoundingClientRect();
        diffX = -(imgBounding.width - window.innerWidth) / 2;
        diffY = -(imgBounding.height - window.innerHeight) / 2;
        diffX += window.innerWidth * 0.286806;
        diffY += window.innerWidth * 0.183333;
    } else {
        let imgBounding = container.getBoundingClientRect();
        diffX = -(imgBounding.width - window.innerWidth) / 2;
        diffY = -(imgBounding.height - window.innerHeight) / 2;
    }
    sx += diffX;
    sy += diffY;
}

// Linear Interpolation method for smooth scrolling
function lerp(a, b, n) {
    return (1 - n) * a + n * b;
}

startPosition();

// Animation Loop
window.requestAnimationFrame(render);

function render() {
    // body.style.height = main.clientHeight + 'px';
    // Function here that checks position of 
    updatePosition();
    // explorerUpdatePosition();
    updatePointerPosition();
    // updatePointerSize();
    pastLimits();
    // And we loop again.
    window.requestAnimationFrame(render);
}