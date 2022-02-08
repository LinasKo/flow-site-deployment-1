import React from "react";
import flow_1 from './assets/animation/flow_1.mp4';


const VideoThree = () => {
  return (
    <div className='section fp-auto-height-responsive' id='video-section-three'>
      <div className='container'>
        <div className='row'>
          <div className='video-section__video__three'>
            <video
              className='women-video'
              src={flow_1}
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

export default VideoThree;