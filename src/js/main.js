import LocomotiveScroll from 'locomotive-scroll';

const video_sources = ['./knee_final_small.mp4', './rad.mp4', './ketchup_final_small.mp4', './rain_final_small.mp4', './dots_2.mp4','./wasser_final_small.mp4','./aldi.mp4','./sieder_2.mp4','./sieder_final_small.mp4'];
const section_ids = ['#page_start', '#page_bike', '#page_ketchup', '#page_rain', '#page_dots', '#page_sieder', '#page_breathe', '#page_sieder2', '#page_empty'];

function clamp(num, min, max){
    if (num > max){
        return min;
    }
    if (num < min){
        return max;
    }
    return num;
}

function randn_bm(min, max, skew) {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0){ 
      num = randn_bm(min, max, skew); // resample between 0 and 1 if out of range
    }
    else{
      num = Math.pow(num, skew); // Skew
      num *= max - min; // Stretch to fill range
      num += min; // offset to min
    }
    return num;
  }


function setupRain(){
    function makeCtrl(top, left, scrollpos, scrollspeed){
        var l = document.createElement('a');
        l.classList.add('btn_scroll');
        l.classList.add('ctrl_bk');
        l.setAttribute('data-scrollpos', scrollpos);
        l.setAttribute('href', 'javascript:void(0)');
        l.style.position = 'absolute';
        l.style.top = top;
        l.style.left = left;
        l.setAttribute('data-scroll', '');
        l.setAttribute('data-scroll-speed', scrollspeed);
        l.innerHTML = '<span class="material-symbols-outlined"> arrow_downward </span>'; 
        return l;
    }

    for(var i = 0; i < 600; i++){
        const top = randn_bm(-300,1080, 0.6);
        var ct = makeCtrl(`${top}px`,`${(Math.random()*130)-15.0}%`, top + 250, (Math.random()*10).toString());
        document.querySelector('#page_rain').appendChild(ct);
    }
}


window.addEventListener('load', function () {

    setupRain();
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
    this.document.querySelector('#loading-container').addEventListener('animationend', () => {
        this.document.querySelector('#loading-container').style.display = 'none';
        this.document.querySelector('#loading-container').classList.remove('anim-fade-out');
     });

    var videos = [video1, video2];
    var source_pos = 0;
    var pos_before = 0;
    var ketchupPos = 0;
    var video = video0;
    const btnNext = this.document.querySelector('#next');
    const btnPrev = this.document.querySelector('#prev');
    const scrollBtns = this.document.querySelectorAll('.btn_scroll');
    scrollBtns.forEach((value) => {
        var scrollpos = parseInt(value.dataset.scrollpos);
        value.addEventListener('click', () => {scroll.scrollTo(scrollpos);});
    });

    function onSectionOpen(section){
        if (section == '#page_dots'){
            document.querySelector('#plotter_audio').play();
        }
    }
    
    function onSectionClose(section){
        if (section == '#page_dots'){
            document.querySelector('#plotter_audio').pause();
        }
    }

    document.addEventListener('keypress', (event) => {
       // console.log(event.key);
        if ((section_ids[source_pos] == '#page_ketchup') && event.key == 'Enter'){
            event.preventDefault();
            if (ketchupPos == 0){
                ketchupPos = 570;
            }else if (ketchupPos < 2200){
                ketchupPos += 90;
            }else{
                ketchupPos = 0;
            }
            scroll.scrollTo(ketchupPos);
        }
    });


    function next_source(backwards){
        if (backwards){
            source_pos = clamp((source_pos - 1), 0, video_sources.length -1);
            return video_sources[clamp((source_pos - 1), 0, video_sources.length -1)];
        } else {
            source_pos = clamp((source_pos + 1), 0, video_sources.length -1);
            return video_sources[clamp((source_pos + 1), 0, video_sources.length -1)];
        }
        
    }
    
    function checkLoading(timeout){
        function innerCheck(){
            if ((video.readyState == 4) || (timeout <= 50)){
                document.querySelector('#display-container').style.visibility = 'visible';
                document.querySelector('#loading-container').classList.add('anim-fade-out');
                return;
            }else{
                setTimeout(checkLoading(timeout - 50), 50);
            }
        }
        return innerCheck;
    }

    function next_video(backwards){
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
        var src = next_source(backwards);
        source.setAttribute('src', src);
        source.setAttribute('type', 'video/mp4');
        videos[vnum].appendChild(source);
        videos[vnum].load(); 
        /*console.log('Backwards: ', backwards);
        console.log('vnum: %d, anum: %d', vnum, anum);
        console.log('src: ', src);*/
        document.querySelector(section_ids[pos_before]).style.visibility = 'hidden';
        document.querySelector(section_ids[source_pos]).style.visibility = 'visible';
        onSectionOpen(section_ids[source_pos]);
        onSectionClose(section_ids[pos_before]);
        pos_before = source_pos;
        if (video.readyState < 4){
            document.querySelector('#display-container').style.visibility = 'hidden';
            document.querySelector('#loading-container').style.display = 'block';
            setTimeout(checkLoading(10000));
        }

        scroll.scrollTo(0);
    }

    /*  var src = new Promise(resolve => {
            const res = fetch(next_source(backwards));
            const blob = res.blob();
            resolve(URL.createObjectURL(blob));
        }).then(result => {
            var source = document.createElement('source');
            source.setAttribute('src', result);
            source.setAttribute('type', 'video/mp4');
            videos[vnum].appendChild(source);
            videos[vnum].load(); 
        });
        */

    btnNext.addEventListener('click', (args) => {
        next_video(false, args);
    });

    btnPrev.addEventListener('click', (args) => {
        next_video(true, args);
    });
    
    scroll.on('scroll', (args) => {
        if(typeof args.currentElements['el0'] === 'object') {
            let progress = args.currentElements['el0'].progress;
            vidProg = Math.min(Math.max(progress-0.17,0.02)*1.8,0.98);
            if (!isFinite(vidProg)){
                vidProg = 0;
            }
            //console.log('progress:', vidProg);
            if (Math.abs(args.speed) > 0.2){
                video.currentTime = Math.fround(video.duration * vidProg);
            }
            if(args.speed == 0){
                videos.forEach((value) => {
                    const time = Math.fround(value.duration * vidProg);
                    if (isFinite(time)){
                        value.currentTime = time;
                    }
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