import React from "react";
import mobile from './assets/animation/mobile.mp4'


const Program = () => {
  return (
    <div className='section fp-auto-height-responsive' id='program'>
      <div className='container'>
        <div className='row'>
          <h1 className='program-title'>Taking structured programs to a new level</h1>
        </div>
        <div className='row'>
          <div className='col-md-4' id='program-first_column'>
            <h2>Whatever you’re mood’s like, we’ll find a class that helps you move
              <span> even if it’s from your bed</span>
            </h2>
          </div>
          <div className='col-md-4' id='program-second_column'>
            <video
              className="video"
              src={mobile}
              autoPlay
              muted
              loop
            ></video>
          </div>
          <div className='col-md-4' id='program-third_column'>
            <h1>No more abandoned resolutions!</h1>
            <p>Sophie, our chatbot will take your goals and recommend programs</p>
          </div>
        </div>
      </div>
    </div>

  );
}

export default Program;