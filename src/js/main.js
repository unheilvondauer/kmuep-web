//import {Curtains, Plane} from "curtainsjs"; 
import LocomotiveScroll from 'locomotive-scroll';


//const video_sources = ['./dots.mp4', './knee1.mp4', './knee2.mp4'];

window.addEventListener('load', function () {
    const scroll = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true,
        lerp: 0.05
    });

    var vidProg = 0.0;
    const video0 = document.querySelector('#video-0');
    const video1 = document.querySelector('#video-1');
    const video2 = document.querySelector('#video-2');
    var videos = [video1, video2, video0];
    var video = video0;
    const btnNext = this.document.querySelector('#next');
    const btnPrev = this.document.querySelector('#prev');


    btnNext.addEventListener('click', (args) => {
        console.log(args);
        video.classList.remove('video-current');
        video.classList.add('video-queued');
        video = videos.shift();
        videos.push(video);
        video.classList.remove('video-queued');
        video.classList.add('video-current');
    });

    btnPrev.addEventListener('click', (args) => {
        console.log(args);
        video.classList.remove('video-current');
        video.classList.add('video-queued');
        video = videos.pop();
        videos.unshift(video);
        video.classList.remove('video-queued');
        video.classList.add('video-current');
    });
    
    scroll.on('scroll', (args) => {
        // Get all current elements : args.currentElements
        //console.log(args);
        if(typeof args.currentElements['el0'] === 'object') {
            let progress = args.currentElements['el0'].progress;
            //console.log(progress);
            vidProg = progress;
            video.currentTime = video.duration * vidProg;
            // ouput log example: 0.34
            // gsap example : myGsapAnimation.progress(progress);
        }
    });

    /*const registerVideo = () => {
        console.log('register');
        const video = document.getElementById('background-video');
        const scrollVideo = ()=>{
            if(video.duration) {
                //const distanceFromTop = window.scrollY + bound.getBoundingClientRect().top
                video.currentTime = video.duration * vidProg;
            }
            requestAnimationFrame(scrollVideo);
        };
        requestAnimationFrame(scrollVideo);
    };

    registerVideo();*/
  }, false);