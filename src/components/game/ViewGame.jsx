import { useState, useEffect, useRef } from 'react'

import downdogTutorialVideo from '../assets/videos/bad-kungfu-2.mp4';
import chaturangaTutorialVideo from '../assets/videos/bad-kungfu-3.mp4';
import updogTutorialVideo from '../assets/videos/bad-kungfu-4.mp4';

import './ViewGame.scss';


const POSES = [
  {
    id: "downdog",
    name: "Down Dog",
    tutorialVideo: downdogTutorialVideo,
  },
  {
    id: "chaturanga",
    name: "Chaturanga",
    tutorialVideo: chaturangaTutorialVideo,
  },
  {
    id: "updog",
    name: "Up Dog",
    tutorialVideo: updogTutorialVideo,
  }
]

export default function ViewGame({ cbGameComplete }) {
  const [poseIndex, setPoseIndex] = useState(0);
  const yogaPoseRef = useRef(POSES[poseIndex]);
  const [buttonText, setButtonText] = useState(`Next: ${POSES[1].name}`);


  useEffect(() => {
    if (poseIndex === POSES.length - 1) {
      setButtonText("Get Feedback");
    } else {
      const nextPose = POSES[poseIndex + 1];
      setButtonText(`Next: ${nextPose.name}`);
      console.log("Showing pose:", nextPose.name);
    }
  }, [poseIndex]);

  function onClickNext() {
    console.log("Leaving", yogaPoseRef.current.name);
    if (poseIndex === POSES.length - 1) {
      cbGameComplete();
    } else {
      setPoseIndex(poseIndex + 1);
      yogaPoseRef.current = POSES[poseIndex + 1];
    }
    console.log(`New pose: ${yogaPoseRef.current.name}`);
  }

  return (
    <div className="gameRoot">

      {/* TODO: Video / Webcam */}

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




  // xD
  //  ↓
  // const drawingConfigs = useRef({
  //   targetPose: DEFAULT_TARGET_POSE,

  //   colorBase: DEFAULT_COLOR_BASE,
  //   thicknessLink: DEFAULT_THICKNESS_CONNECTOR,
  //   thicknessCircleOuter: DEFAULT_THICKNESS_CIRCLE_OUTER,

  //   colorMiddle: DEFAULT_COLOR_MIDDLE,
  //   colorLeft: DEFAULT_COLOR_LEFT,
  //   colorRight: DEFAULT_COLOR_RIGHT,
  //   thicknessCircleInner: DEFAULT_THICKNESS_CIRCLE_INNER,

  //   colorSegmentation: DEFAULT_COLOR_SEGMENTATION,
  //   colorGood: DEFAULT_COLOR_GOOD,
  //   colorBad: DEFAULT_COLOR_BAD,
  //   colorGradedBase: DEFAULT_COLOR_GRADED_BASE,
  //   thicknessGraded: DEFAULT_THICKNESS_GRADED,
  // });  // bad practice, tightly couples ConfigsPane to poseVisuals. Fuck it, need to do this fast.

  // // Stop / Start when asked
  // const [isPlaying, setIsPlaying] = useState(true);
  // const startButtonRef = useRef(null);
  // const stopButtonRef = useRef(null);
  // const cameraRef = useRef(null);

  // function toggleStream(newState) {
  //   setIsPlaying(newState);
  //   const camera = cameraRef.current;
  //   if (camera) {
  //     if (newState) {
  //       camera.start();
  //     } else {
  //       camera.stop();
  //     }
  //   }
  // }

  // useEffect(() => {
  //   function drawPose(poseDetResults, embedding, scores, segmentation = false) {
  //     const canvas = canvasRef.current;
  //     const ctx = canvasRef.current.getContext('2d');
  //     ctx.clearRect(0, 0, canvas.width, canvas.height);

  //     if (segmentation) {
  //       drawWithSegmentation(canvas, poseDetResults);
  //     } else {
  //       drawSimpleImage(canvas, poseDetResults.image, FLIP_VIDEO)
  //     }
  //     // drawMpConnections(canvas, poseDetResults);
  //     drawConnections(canvas, embedding, drawingConfigs.current, FLIP_VIDEO);
  //     drawScores(canvas, embedding, scores, drawingConfigs.current, FLIP_VIDEO);
  //     drawPoints(canvas, embedding, drawingConfigs.current, FLIP_VIDEO);
  //   }

  //   function onPoseResult(results) {

  //     const embedding = makeFullEmbedding(results);
  //     let scores;
  //     if (embedding) {
  //       scores = jointScores(drawingConfigs.current.targetPose, embedding);
  //     }
  //     drawPose(results, embedding, scores, ENABLE_SEGMENTATION);
  //   }

  //   const pose = new Pose({
  //     locateFile: (file) => {
  //       return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
  //     }
  //   });
  //   pose.setOptions({
  //     modelComplexity: 1,
  //     smoothLandmarks: true,
  //     enableSegmentation: ENABLE_SEGMENTATION,
  //     smoothSegmentation: ENABLE_SEGMENTATION,
  //     minDetectionConfidence: 0.5,
  //     minTrackingConfidence: 0.5
  //   });
  //   pose.onResults(onPoseResult);

  //   const video = videoRef.current;
  //   const camera = new Camera(video, {
  //     onFrame: async () => {
  //       await pose.send({ image: video });
  //     },
  //     width: 1280,
  //     height: 720
  //   });
  //   cameraRef.current = camera;
  //   camera.start();

  //   // DEBUG
  //   // setTimeout(() => {
  //   //   camera.stop();
  //   // }, 10000);

  //   // TODO: Lifting arm to 90 deg still keeps the color green (but not lowering it down). Why?
  //   //       Likely the same issue happens in the Python impl too!

  //   return () => {
  //     camera.stop();
  //   }
  // }, []);

  // return (
  //   <div className="gameRoot">
  //     <h1>Willkommen zur LosFlow!</h1>

  //     <div className="row">
  //       <div className="videoContainer">
  //         <video className="inputVideo" ref={videoRef}></video>
  //         <canvas className="outputCanvas" ref={canvasRef} width="1280px" height="720px"></canvas>
  //         {/* <div className="videoMock" width="1280px" height="720px"></div> */}
  //         {isPlaying && <button ref={stopButtonRef} onClick={() => toggleStream(false)}>Stahp</button>}
  //         {!isPlaying && <button ref={startButtonRef} onClick={() => toggleStream(true)}>Geht mal, bitte schon.</button>}
  //       </div>
  //     </div>
  //   </div>
  // );