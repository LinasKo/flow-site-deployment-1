import React from "react";
import flow_2 from '../assets/animation/flow_2.mp4';


const VideoFour = () => {
  return (
    <div className='section fp-auto-height-responsive' id='video-section-four'>
      <div className='container'>
        <div className='row'>
          <div className='video-section__video__four'>
            <video
              className='women-video'
              src={flow_2}
              autoPlay
              muted
              loop
            ></video>
          </div>
          <div className='video-section__text-four'>
            <h1>You just need your laptop,
              <span>tablet or, phone to get instant and precise </span>
              feedback
            </h1>
          </div>
        </div>
      </div>
    </div>

  );
}

export default VideoFour;