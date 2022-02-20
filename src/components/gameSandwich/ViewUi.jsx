import { useState, useEffect, useRef } from 'react'
import './ViewUi.scss';

import PropTypes from 'prop-types';

import ViewStart from './ViewStart';
import ViewIntro from './ViewIntro';


const GameStage = {
  PRE_START: "pre_start",
  INTRO: "intro",
  CALIBRATING: "calibrating",
  PLAYING: "playing",
  FEEDBACK: "feedback"
};

export default function ViewUi({ onRequestFullscreen, onStartTracking, actions }) {
  const [gameStage, setGameStage] = useState(GameStage.PRE_START);

  // Export functions
  useEffect(() => {
  })

  function handleClickStart() {
    onRequestFullscreen();
    setGameStage(GameStage.INTRO);
  }

  function handleEmailSubmitted() {
    onStartTracking();
    setGameStage(GameStage.CALIBRATING);
  }

  return (
    <div className="uiRoot">
      {gameStage === GameStage.PRE_START &&
        <ViewStart onStart={handleClickStart}
        />}
      {gameStage === GameStage.INTRO && (
        <ViewIntro onEmailSubmitted={handleEmailSubmitted} />
      )}
      {/* {gameStage === GameStage.CALIBRATING && (
        <ViewCalib cbCalibComplete={onCalibComplete} />
      )} */}

      {/*gameStage === GameStage.PLAYING && (
        <ViewGame cbGameComplete={onGameComplete} />
      )}
      {gameStage === GameStage.FEEDBACK && (
        <ViewFeedback />
      )} */}
    </div>
  )
}

PropTypes.ViewUi = {
  onRequestFullscreen: PropTypes.func.isRequired,
  onStartTracking: PropTypes.func.isRequired,
  actions: PropTypes.object.isRequired,
}
