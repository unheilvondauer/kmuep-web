//import {Curtains, Plane} from "curtainsjs"; 
import LocomotiveScroll from 'locomotive-scroll';



window.addEventListener('load', function () {
    const scroll = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true,
        lerp: 0.05
    });

    var vidProg = 0.0;
    const video = document.querySelector('#background-video');
    
    scroll.on('scroll', (args) => {
        // Get all current elements : args.currentElements
        console.log(args);
        if(typeof args.currentElements['el0'] === 'object') {
            let progress = args.currentElements['el0'].progress;
            console.log(progress);
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