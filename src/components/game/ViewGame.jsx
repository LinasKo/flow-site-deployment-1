import { useState, useEffect, useRef } from 'react'
import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";

import {
  drawSimpleImage,
  clearCanvas,
  drawBasicConnection
} from 'js/drawing';

import downdogTutorialVideo from '../assets/videos/bad-kungfu-2.mp4';
import chaturangaTutorialVideo from '../assets/videos/bad-kungfu-3.mp4';
import updogTutorialVideo from '../assets/videos/bad-kungfu-4.mp4';

import './ViewGame.scss';
import FancyLoader from './FancyLoader';
import ResponsiveCanvas from './ResponsiveCanvas';

import GameUi from './GameUi';


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
];

const IDEAL_VID_W = 1920;
const IDEAL_VID_H = 1080;
const IDEAL_ASPECT = IDEAL_VID_W / IDEAL_VID_H;

const POSE_OPTS = {
  modelComplexity: 1,  // [0, 1, 2]
  smoothLandmarks: true,
  enableSegmentation: false,
  smoothSegmentation: false,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
};


export default function ViewGame({ cbGameComplete }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [poseIndex, setPoseIndex] = useState(0);
  const yogaPoseRef = useRef(POSES[poseIndex]);
  const [buttonText, setButtonText] = useState(`Next: ${POSES[1].name}`);
  const cameraRef = useRef(null);

  /** Call UI functions without updating parent (ViewGame) */
  const uiEvents = {};

  useEffect(() => {
    function onPoseResult(results) {
      if (!canvasRef.current) return;  // Calib done

      clearCanvas(canvasRef.current);
      drawSimpleImage(canvasRef.current, results.image, true);
    }

    // Set button text
    if (poseIndex === POSES.length - 1) {
      setButtonText("Get Feedback");
    } else {
      const nextPose = POSES[poseIndex + 1];
      setButtonText(`Next: ${nextPose.name}`);
    }

    // Init pose tracker
    const pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      }
    });
    pose.setOptions(POSE_OPTS);
    pose.onResults(onPoseResult);

    // Start Camera
    const video = videoRef.current;
    const camera = new Camera(video, {
      onFrame: async () => {
        await pose.send({ image: video });
      },
      width: IDEAL_VID_W,
      height: IDEAL_VID_H,
      facingMode: 'user',
    });
    camera.start();

    return () => {
      camera.stop();
      pose.close();
    }
  }, [poseIndex]);

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

      <div className="loaderPane">
        <h1>Loading...</h1>
        <FancyLoader />
      </div>

      <video className="inputVideo" ref={videoRef}></video>
      <ResponsiveCanvas canvasRef={canvasRef} idealAspect={IDEAL_ASPECT} />

      <GameUi extEvents={uiEvents} />

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