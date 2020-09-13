import {shows} from './content.js';
// console.log(shows);
// console.log(shows[0].images);
// console.log(typeof shows);


// Init container, body, and cursor
const main = document.getElementById('main');
const cursorInner = document.getElementById('cursor_inner');
const cursorOuter = document.getElementById('cursor_outer');
const container = document.getElementById('gallery');
const imgs = document.getElementsByClassName('gallery_img')
const navLeft = document.getElementById('nav_left');
const navRight = document.getElementById('nav_right');

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
outerBorder = 4;
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
    outerBorder = 1;
    e.target.addEventListener('mousedown', pressingDown);
    e.target.addEventListener("mouseup", notPressingDown);
    e.target.addEventListener("mouseleave", notPressingDown);
}
function mouseLeave(e) {
    outerScale = .25;
    outerBorder = 4;
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
    outerBorder = 1;
    counter = 0;
    // console.log("Not pressing!");
}

// Timer function for hold animaion
function timer() {
    console.log("Timer tick! " + counterPct);
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
    navLeft.style.marginTop = '-1vw'
    navRight.style.opacity = '0';
    navRight.style.marginTop = '-1vw'
}

function redirect() {
    window.location.href = 'index.html';
}


// Establishing Event Listeners for navigation and cursor
window.addEventListener('mousemove', initialPointer);
window.addEventListener('mousemove', findPointerPosition);
window.addEventListener('mousemove', findDifference);
window.addEventListener('mousedown', onPointerDown)
window.addEventListener('mouseup', onPointerUp);
window.addEventListener('wheel', scroll);

// On scroll, update position variables
function scroll(e) {
    console.log(e.deltaX + ', ' + e.deltaY);
    sx -= e.deltaX;
    sy -= e.deltaY;
}

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
        diffX =  -imgBounding.left / 16;
        sx += diffX;
    }
    // If  scroll past right limit
    if (imgBounding.right <= window.innerWidth) {
        diffX = (window.innerWidth - imgBounding.right) / 16;
        sx += diffX;
    }
    // If  scroll past top limit
    if (imgBounding.top >= 0) {
        diffY = -imgBounding.top / 16;
        sy += diffY;
    }
    // If  scroll past bottom limit
    if (imgBounding.bottom <= window.innerHeight) {
        diffY = (window.innerHeight - imgBounding.bottom) / 16;
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
    updatePointerPosition();
    // updatePointerSize();
    pastLimits();
    // And we loop again.
    window.requestAnimationFrame(render);
}