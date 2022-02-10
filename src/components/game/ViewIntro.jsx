import { useRef, useState } from 'react'
import introVideo from "../assets/videos/cat-weugh.mp4";
import './ViewIntro.scss';


const IntroStage = {
  WAITING: "waiting",
  PLAYING: "playing",
  FINISHED: "finished"
}

export default function ViewIntro({ cbStart, cbEmailSubmit }) {
  const videoRef = useRef(null);
  const emailInRef = useRef(null);

  const [stage, setStage] = useState(IntroStage.WAITING);


  function onClickStart() {
    cbStart();
    setStage(IntroStage.PLAYING);
  }

  function onEmailSubmit() {
    cbEmailSubmit(emailInRef.current.value);
  }

  return (
    <div className="introRoot">

      {stage === IntroStage.WAITING && (
        <button className="startButton" onClick={onClickStart}>
          Start
        </button>
      )}

      {(stage === IntroStage.PLAYING || stage === IntroStage.FINISHED) && (
        <>
          <video ref={videoRef} autoPlay={"autoplay"} src={introVideo} />

          <div className="emailForm">
            <input ref={emailInRef} type="email" placeholder="Enter your email..." />
            <button onClick={onEmailSubmit}>Let's Start</button>
          </div>
        </>
      )}
    </div>
  )
}
