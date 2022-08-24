//import {Curtains, Plane} from "curtainsjs"; 
import LocomotiveScroll from 'locomotive-scroll';


const video_sources = ['./knee_final_small.mp4', './ketchup_final_small.mp4', './rain_final_small.mp4', './sieder_final_small.mp4'];
const section_ids = ['#data-0', '#data-1', '#data-2', '#data-3'];

function clamp(num, min, max){
    if (num > max){
        return min;
    }
    if (num < min){
        return max;
    }
    return num;
}


window.addEventListener('load', function () {
    const scroll = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true,
        lerp: 0.1,
        getSpeed: true
    });

    var vidProg = 0.0;
    const video0 = document.querySelector('#video-0');
    const video1 = document.querySelector('#video-1');
    const video2 = document.querySelector('#video-2');

    video0.addEventListener('animationend', () => {video0.classList.remove('video-current'); video0.classList.add('video-queued');});
    video1.addEventListener('animationend', () => {video1.classList.remove('video-current'); video1.classList.add('video-queued');});
    video2.addEventListener('animationend', () => {video2.classList.remove('video-current'); video2.classList.add('video-queued');});

    var videos = [video1, video2];
    var source_pos = 0;
    var pos_before = 0;
    var video = video0;
    const btnNext = this.document.querySelector('#next');
    const btnPrev = this.document.querySelector('#prev');


    function next_source(backwards){
        if (backwards){
            source_pos = clamp((source_pos - 1), 0, video_sources.length -1);
            return video_sources[clamp((source_pos - 1), 0, video_sources.length -1)];
        } else {
            source_pos = clamp((source_pos + 1), 0, video_sources.length -1);
            return video_sources[clamp((source_pos + 1), 0, video_sources.length -1)];
        }
        
    }

    function next_video(backwards, args){
        console.log(args);
        var anum = 1;
        var vnum = 0;
        if (backwards){
            videos.unshift(video);
            video = videos.pop();
            vnum = 1;
            anum = 0;
        }else{
            videos.push(video);
            video = videos.shift();
            vnum = 0;
            anum = 1;
        }
        video.classList.remove('anim-fade-out');
        video.classList.remove('video-queued');
        video.classList.add('video-current');
        videos[anum].classList.add('anim-fade-out');
        videos[vnum].removeChild(videos[vnum].children[0]);
        var source = document.createElement('source');
        source.setAttribute('src', next_source(backwards));
        source.setAttribute('type', 'video/mp4');
        videos[vnum].appendChild(source);
        videos[vnum].load(); 

        document.querySelector(section_ids[source_pos]).style.visibility = 'visible';
        document.querySelector(section_ids[pos_before]).style.visibility = 'hidden';
        pos_before = source_pos;

        scroll.scrollTo(0.18);

    }
    btnNext.addEventListener('click', (args) => {
        next_video(false, args);
    });

    btnPrev.addEventListener('click', (args) => {
        next_video(true, args);
    });
    
    scroll.on('scroll', (args) => {
        // Get all current elements : args.currentElements
        console.log(args.speed);
        if(typeof args.currentElements['el0'] === 'object') {
            let progress = args.currentElements['el0'].progress;
            console.log(progress);
            vidProg = Math.min(Math.max(progress-0.17,0.01)*1.8,0.99);

            video.currentTime = video.duration * vidProg;
            if(args.speed == 0){
                videos.forEach((value) => {
                    value.currentTime = value.duration * vidProg;
                });
            }
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