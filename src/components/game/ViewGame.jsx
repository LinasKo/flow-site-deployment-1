import { useState, useEffect, useRef } from 'react'
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


export default function ViewGame({ cbGameComplete, actions }) {
  const [poseIndex, setPoseIndex] = useState(0);
  const yogaPoseRef = useRef(POSES[poseIndex]);
  const [buttonText, setButtonText] = useState(`Next: ${POSES[1].name}`);
  const cameraRef = useRef(null);

  useEffect(() => {
    actions.tellPoseDetected = handlePoseDetected;
  });

  function handlePoseDetected(poseDetResults) {
  }

  function onClickNext() {
    if (poseIndex === POSES.length - 1) {
      cbGameComplete();
    } else {
      setPoseIndex(poseIndex + 1);
      yogaPoseRef.current = POSES[poseIndex + 1];
    }
  }

  return (
    <div className="gameRoot">
      <select className="modeSelector">
        <option value="exercise">{yogaPoseRef.current.name}</option>
        <option value="tutorial">Tutorial</option>
      </select>

      <div className="endText">
        Well Done!
      </div>

      <button onClick={onClickNext}>{buttonText}</button>

    </div>
  )
}
