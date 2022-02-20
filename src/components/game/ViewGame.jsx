import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import './ViewGame.scss';

import kungfu1 from '../assets/videos/bad-kungfu-2.mp4';
import kungfu2 from '../assets/videos/bad-kungfu-3.mp4';
import kungfu3 from '../assets/videos/bad-kungfu-4.mp4';


const POSES = [
  {
    id: "downdog",
    name: "Down Dog",
    tutorialVideo: kungfu1,
  },
  {
    id: "chaturanga",
    name: "Chaturanga",
    tutorialVideo: kungfu2,
  },
  {
    id: "updog",
    name: "Up Dog",
    tutorialVideo: kungfu3,
  }
];


export default function ViewGame({ onGameComplete, actions }) {
  const [tutorialMode, setTutorialMode] = useState(false);

  const [poseIndex, setPoseIndex] = useState(0);
  const [modeButtonText, setModeButtonText] = useState("");
  const [nextButtonText, setNextButtonText] = useState("");

  useEffect(() => {
    actions.tellPoseDetected = handlePoseDetected;
  });

  function handlePoseDetected(poseDetResults) {
  }

  function handleClickChangeMode() {
    setTutorialMode(!tutorialMode);
  }

  function onClickNext() {
    if (poseIndex === POSES.length - 1) {
      onGameComplete();
    } else {
      setPoseIndex(poseIndex + 1);

    }
  }

  // Update values based on mode & new pose
  useEffect(() => {
    if (tutorialMode) {
      const thisPose = POSES[poseIndex];
      setModeButtonText(`Back to: ${thisPose.name}`);
    } else {
      setModeButtonText("Tutorial");
    }

    if (poseIndex + 1 <= POSES.length - 1) {
      setNextButtonText(`Next: ${POSES[poseIndex + 1].name}`);
    } else {
      setNextButtonText("Feedback");
    }
  }, [poseIndex, tutorialMode])

  return (
    <div className="gameRoot">
      <button className="modeSelector"
        onClick={handleClickChangeMode}
      >
        {modeButtonText}
      </button>

      <div className="endText">
        Well Done!
      </div>

      <button className="nextButton" onClick={onClickNext}>{nextButtonText}</button>

    </div>
  )
}
