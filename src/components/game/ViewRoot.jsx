import { useRef, useEffect, useState } from 'react';

// import { Pose } from "@mediapipe/pose";
// import { Camera } from "@mediapipe/camera_utils";

// import { makeFullEmbedding } from '../../js/poseEmbedder';
// import { jointScores } from '../../js/poseFeedback';
// import {
//   drawWithSegmentation,
//   drawSimpleImage,
//   drawConnections,
//   drawPoints,
//   drawScores
// } from '../../js/poseVisuals';

import './ViewRoot.css';

import ViewIntro from './ViewIntro';
import ViewCalib from './ViewCalib';
import ViewGame from './ViewGame';
import ViewFeedback from './ViewFeedback';

const GameStage = {
  PRE_START: "pre_start",
  INTRO: "intro",
  CALIBRATING: "calibrating",
  PLAYING: "playing",
  FEEDBACK: "feedback"
};


export default function ViewRoot() {
  const rootRef = useRef(null);

  const [gameStage, setGameStage] = useState(GameStage.PRE_START);

  function requestFullscreen() {
    const elem = rootRef.current;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    }
  }

  function onClickStart() {
    requestFullscreen();
    setGameStage(GameStage.INTRO);
  }

  function onSubmitEmail(email) {
    console.log("Submitted email:", email);
    setGameStage(GameStage.CALIBRATING);
  }

  function onCalibComplete() {
    console.log("Calibration complete");
    setGameStage(GameStage.PLAYING);
  }

  function onGameComplete() {
    console.log("Game complete");
    setGameStage(GameStage.FEEDBACK);
  }


  return (
    <div className="root" ref={rootRef}>
      {(gameStage === GameStage.PRE_START || gameStage === GameStage.INTRO) && (
        <ViewIntro cbEmailSubmit={onSubmitEmail} cbStart={onClickStart} />
      )}
      {gameStage === GameStage.CALIBRATING && (
        <ViewCalib cbCalibComplete={onCalibComplete} />
      )}
      {gameStage === GameStage.PLAYING && (
        <ViewGame cbGameComplete={onGameComplete} />
      )}
      {gameStage === GameStage.FEEDBACK && (
        <ViewFeedback />
      )}
    </div>
  );
}