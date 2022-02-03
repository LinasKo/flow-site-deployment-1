import React from "react";
import womenVideo from './assets/animation/women_video.mp4';


const VideoTwo = () =>{
    return(
        <div className='section fp-auto-height-responsive' id='video-section-two'>
            <div className='container'>
                <div className='row'>
                    <div className='video-section__video__two'>
                        <video
                                className='women-video'
                                src={womenVideo}
                                autoPlay
                                muted
                                loop
                        ></video>
                    </div>     
                </div>
            </div>
        </div>

    );
}

export default VideoTwo;