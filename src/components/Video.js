import React from "react";
import womenVideo from './assets/animation/women_video.mp4';

const Video = () => {
  return (
    <div className='section fp-auto-height-responsive' id='video-section'>
      <div className='container'>
        <div className='row'>
          <div className='video-section__video'>
            <video
              className='women-video'
              src={womenVideo}
              autoPlay
              muted
              loop
            ></video>
          </div>
          <div className='video-section__text'>
            <h1>Next generation motion detection</h1>
            <p>Move freely with our first-in-class technology <br /> to improve misalignment.</p>
          </div>
        </div>
      </div>
    </div>

  );
}

export default Video;