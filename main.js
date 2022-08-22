$(document).ready(function(){

    const registerVideo = () => {
        console.log("register");
        video = document.getElementById("background-video");
        const scrollVideo = ()=>{
            if(video.duration) {
                console.log("scroll");
                //const distanceFromTop = window.scrollY + bound.getBoundingClientRect().top;
                const maxScroll = Math.max(
                    document.body.scrollHeight,
                    document.body.offsetHeight,
                    document.documentElement.clientHeight,
                    document.documentElement.scrollHeight,
                    document.documentElement.offsetHeight
                  );
                const rawPercentScrolled = (window.scrollY) / (maxScroll);
                const percentScrolled = Math.min(Math.max(rawPercentScrolled, 0), 1);
                video.currentTime = video.duration * percentScrolled;
            }
            requestAnimationFrame(scrollVideo);
        }
        requestAnimationFrame(scrollVideo);
    }

    registerVideo();
  });