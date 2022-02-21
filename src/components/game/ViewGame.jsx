import { useState, useEffect, useRef } from 'react'
import './ViewGame.scss';

import kungfu1 from '../assets/videos/bad-kungfu-2.mp4';
import kungfu2 from '../assets/videos/bad-kungfu-3.mp4';
import kungfu3 from '../assets/videos/bad-kungfu-4.mp4';

import { makeFullEmbedding } from 'js/poseEmbedder';
import { jointScores } from 'js/poseFeedback';
import { drawScores } from 'js/drawing';

import { getScreenSize } from 'js/deviceTools';
import { debounce } from 'lodash';


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
const IDEAL_ASPECT = 1920 / 1080;


function increaseToAspect([width, height], aspect) {
  let newHeight = height;

  let newWidth = Math.round(height * aspect);
  if (newWidth < width) {
    newWidth = width;
    newHeight = Math.round(width / aspect);
    console.assert(newHeight <= height, "increaseToAspect is wrong!", newHeight, ">", height);
  }
  return [newWidth, newHeight];
}

function getIdealCanvasSize(idealAspect) {
  let [sw, sh] = getScreenSize();
  if (sw > sh) {
    [sw, sh] = increaseToAspect([sw, sh], idealAspect);
  } else {
    [sw, sh] = increaseToAspect([sw, sh], 1 / idealAspect);
  }

  return [sw, sh];
}

export default function ViewGame({ onGameComplete, drawOnCanvas, actions }) {
  const [canvasSize, setCanvasSize] = useState(getIdealCanvasSize(IDEAL_ASPECT));
  const [tutorialMode, setTutorialMode] = useState(false);

  const [poseIndex, setPoseIndex] = useState(0);
  const [modeButtonText, setModeButtonText] = useState("");
  const [nextButtonText, setNextButtonText] = useState("");
  const [triedTutorialTimes, setTriedTutorialTimes] = useState(localStorage.getItem("triedTutorialTimes") || 0);

  // External actions
  useEffect(() => {
    actions.tellPoseDetected = handlePoseDetected;
  });

  // Respond to resizes
  useEffect(() => {
    const onResize = () => {
      const [sw, sh] = getIdealCanvasSize(IDEAL_ASPECT);
      setCanvasSize([sw, sh]);
    }
    const debouncedOnResize = debounce(onResize, 100);

    window.addEventListener('resize', debouncedOnResize);
    return () => {
      window.removeEventListener('resize', debouncedOnResize);
    }
  }, []);

  // Handlers

  function handlePoseDetected(poseDetResults) {
    if (tutorialMode) return;

    const embedding = makeFullEmbedding(poseDetResults);
    if (!embedding) return;

    const pose = POSES[poseIndex];
    const scores = jointScores(pose.id, embedding);

    drawOnCanvas((canvas) => drawScores(canvas, embedding, scores, null, true));

    // TODO: scores are random
    // TODO: torso is removed

    // Iterate over scores
    let total = 0;
    for (const linkName in scores) {
      if (linkName === "torso") continue;
      total += scores[linkName];
    }
    total /= Object.keys(scores).length;

    console.log(total);
  }

  function handleClickTutorial() {
    setTriedTutorialTimes(triedTutorialTimes + 1);
    localStorage.setItem("triedTutorialTimes", triedTutorialTimes + 1);
    setTutorialMode(true);
  }

  function handleClickBackToPose() {
    setTutorialMode(false);
  }

  function handleClickNext() {
    if (poseIndex === POSES.length - 1) {
      onGameComplete();
    } else {
      setPoseIndex(poseIndex + 1);
    }
  }

  // Update values based on mode & new pose
  useEffect(() => {
    const thisPose = POSES[poseIndex];
    setModeButtonText(thisPose.name);

    if (poseIndex + 1 <= POSES.length - 1) {
      setNextButtonText(`Next: ${POSES[poseIndex + 1].name}`);
    } else {
      setNextButtonText("Feedback");
    }
  }, [poseIndex])

  return (
    <div className="gameRoot">
      <h1 className="modeText">
        {modeButtonText}
      </h1>

      {!tutorialMode && (<>
        <div className="helperVideoPanel"
          onClick={handleClickTutorial}
        >
          <video
            autoPlay={true}
            muted={true}
            loop={true}
            src={POSES[poseIndex].tutorialVideo}
            width={Math.round(canvasSize[0] * 0.2)}
          />

          {triedTutorialTimes < 2 && (<>
            <div className="videoCover" />
            <div className="tutorialPrompt">Press for tutorial</div>
          </>)}
        </div>

        <button className="nextButton" onClick={handleClickNext}>
          {nextButtonText}
        </button>

        {/* <div className="endText">
          Well Done!
        </div> */}

      </>)}

      {tutorialMode && (<>
        <video
          autoPlay={true}
          muted={false}
          loop={true}
          controls={true}
          src={POSES[poseIndex].tutorialVideo}
          width={canvasSize[0]}
          height={canvasSize[1]}
        />

        <button className="backToPoseButton"
          onClick={handleClickBackToPose}
        >
          Go Back
        </button>
      </>)}

    </div>
  )
}
