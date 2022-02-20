import { useRef, useState, useEffect } from 'react'
import introVideo from "../assets/videos/cat-weugh.mp4";
import './ViewIntro.scss';


export default function ViewIntro({ onEmailSubmitted }) {
  const videoRef = useRef(null);
  const emailInRef = useRef(null);

  function handleEmailSubmit() {
    // TODO: log email
    console.log("Submitted email:", emailInRef.current.value);

    onEmailSubmitted();
  }

  return (
    <div className="introRoot">
      <video ref={videoRef} autoPlay={"autoplay"} src={introVideo} />

      <div className="emailForm">
        <input ref={emailInRef} type="email" placeholder="Enter your email..." />
        <button onClick={handleEmailSubmit}>Let's Start</button>
      </div>
    </div>
  )
}
