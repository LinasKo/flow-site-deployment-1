import { useState, useEffect, useRef } from 'react'
import './ViewUi.scss';

import PropTypes from 'prop-types';
import { has } from 'lodash';

import ViewStart from './ViewStart';
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

export default function ViewUi({ onRequestFullscreen, onStartTracking, drawOnCanvas, actions }) {
  const [gameStage, setGameStage] = useState(GameStage.PRE_START);
  const viewActions = {};

  // Export functions
  useEffect(() => {
    actions.tellPoseDetected = handlePoseDetected;
  })

  function handleClickStart() {
    console.log("[UI] Start Clicked");
    onRequestFullscreen();
    setGameStage(GameStage.INTRO);
  }

  function handleEmailSubmitted() {
    console.log("[UI] Email Submitted");
    onStartTracking();
    setGameStage(GameStage.CALIBRATING);
  }

  function handlePoseDetected(poseDetResults) {
    console.log("[UI] handlePoseDetected");
    if (has(viewActions, 'tellPoseDetected')) {
      viewActions.tellPoseDetected(poseDetResults);
    }
  }

  function handleValidComplete() {
    console.log("[UI] Validation Complete");
    setGameStage(GameStage.PLAYING);
  }

  function handleGameComplete() {
    console.log("[UI] Game Complete");
    setGameStage(GameStage.FEEDBACK);
  }

  return (
    <div className="uiRoot">
      {gameStage === GameStage.PRE_START &&
        <ViewStart
          onStart={handleClickStart}
          actions={viewActions}
        />}
      {gameStage === GameStage.INTRO && (
        <ViewIntro
          onEmailSubmitted={handleEmailSubmitted}
          actions={viewActions}
        />
      )}
      {gameStage === GameStage.CALIBRATING && (
        <ViewCalib
          onValidComplete={handleValidComplete}
          drawOnCanvas={drawOnCanvas}
          actions={viewActions}
        />
      )}

      {gameStage === GameStage.PLAYING && (
        <ViewGame
          onGameComplete={handleGameComplete}
          actions={viewActions}
        />
      )}
      {gameStage === GameStage.FEEDBACK && (
        <ViewFeedback
          actions={viewActions}
        />
      )}
    </div>
  )
}

PropTypes.ViewUi = {
  onRequestFullscreen: PropTypes.func.isRequired,
  onStartTracking: PropTypes.func.isRequired,
  actions: PropTypes.object.isRequired,
}
