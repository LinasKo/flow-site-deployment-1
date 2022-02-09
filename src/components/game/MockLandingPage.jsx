import { useRef, useEffect, useState } from 'react';

import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";

import ConfigsPane, {
  DEFAULT_TARGET_POSE,

  DEFAULT_COLOR_BASE,
  DEFAULT_THICKNESS_CONNECTOR,
  DEFAULT_THICKNESS_CIRCLE_OUTER,

  DEFAULT_COLOR_MIDDLE,
  DEFAULT_COLOR_LEFT,
  DEFAULT_COLOR_RIGHT,
  DEFAULT_THICKNESS_CIRCLE_INNER,

  DEFAULT_COLOR_SEGMENTATION,
  DEFAULT_COLOR_GOOD,
  DEFAULT_COLOR_BAD,
  DEFAULT_COLOR_GRADED_BASE,
  DEFAULT_THICKNESS_GRADED
} from './ConfigsPane';
import { makeFullEmbedding } from '../pose-tracking/poseEmbedder';
import { jointScores } from '../pose-tracking/poseFeedback';
import {
  drawWithSegmentation,
  drawSimpleImage,
  drawConnections,
  drawPoints,
  drawScores
} from '../pose-tracking/poseVisuals';

import './MockLandingPage.css';


const ENABLE_SEGMENTATION = false;
const FLIP_VIDEO = true;


export default function MockLandingPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // xD
  //  ↓
  const drawingConfigs = useRef({
    targetPose: DEFAULT_TARGET_POSE,

    colorBase: DEFAULT_COLOR_BASE,
    thicknessLink: DEFAULT_THICKNESS_CONNECTOR,
    thicknessCircleOuter: DEFAULT_THICKNESS_CIRCLE_OUTER,

    colorMiddle: DEFAULT_COLOR_MIDDLE,
    colorLeft: DEFAULT_COLOR_LEFT,
    colorRight: DEFAULT_COLOR_RIGHT,
    thicknessCircleInner: DEFAULT_THICKNESS_CIRCLE_INNER,

    colorSegmentation: DEFAULT_COLOR_SEGMENTATION,
    colorGood: DEFAULT_COLOR_GOOD,
    colorBad: DEFAULT_COLOR_BAD,
    colorGradedBase: DEFAULT_COLOR_GRADED_BASE,
    thicknessGraded: DEFAULT_THICKNESS_GRADED,
  });  // bad practice, tightly couples ConfigsPane to poseVisuals. Fuck it, need to do this fast.

  // Stop / Start when asked
  const [isPlaying, setIsPlaying] = useState(true);
  const startButtonRef = useRef(null);
  const stopButtonRef = useRef(null);
  const cameraRef = useRef(null);

  function toggleStream(newState) {
    setIsPlaying(newState);
    const camera = cameraRef.current;
    if (camera) {
      if (newState) {
        camera.start();
      } else {
        camera.stop();
      }
    }
  }

  useEffect(() => {
    function drawPose(poseDetResults, embedding, scores, segmentation = false) {
      const canvas = canvasRef.current;
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (segmentation) {
        drawWithSegmentation(canvas, poseDetResults);
      } else {
        drawSimpleImage(canvas, poseDetResults.image, FLIP_VIDEO)
      }
      // drawMpConnections(canvas, poseDetResults);
      drawConnections(canvas, embedding, drawingConfigs.current, FLIP_VIDEO);
      drawScores(canvas, embedding, scores, drawingConfigs.current, FLIP_VIDEO);
      drawPoints(canvas, embedding, drawingConfigs.current, FLIP_VIDEO);
    }

    function onPoseResult(results) {

      const embedding = makeFullEmbedding(results);
      let scores;
      if (embedding) {
        scores = jointScores(drawingConfigs.current.targetPose, embedding);
      }
      drawPose(results, embedding, scores, ENABLE_SEGMENTATION);
    }

    const pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      }
    });
    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: ENABLE_SEGMENTATION,
      smoothSegmentation: ENABLE_SEGMENTATION,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    pose.onResults(onPoseResult);

    const video = videoRef.current;
    const camera = new Camera(video, {
      onFrame: async () => {
        await pose.send({ image: video });
      },
      width: 1280,
      height: 720
    });
    cameraRef.current = camera;
    camera.start();

    // DEBUG
    // setTimeout(() => {
    //   camera.stop();
    // }, 10000);

    // TODO: Lifting arm to 90 deg still keeps the color green (but not lowering it down). Why?
    //       Likely the same issue happens in the Python impl too!

    return () => {
      camera.stop();
    }
  }, []);

  return (
    <div className="landingPage">
      <h1>Willkommen zur LosFlow!</h1>

      <div className="row">
        <div className="videoContainer">
          <video className="inputVideo" ref={videoRef}></video>
          <canvas className="outputCanvas" ref={canvasRef} width="1280px" height="720px"></canvas>
          {/* <div className="videoMock" width="1280px" height="720px"></div> */}
          {isPlaying && <button ref={stopButtonRef} onClick={() => toggleStream(false)}>Stahp</button>}
          {!isPlaying && <button ref={startButtonRef} onClick={() => toggleStream(true)}>Geht mal, bitte schon.</button>}
        </div>

        <ConfigsPane setDrawingConfigs={(configs) => drawingConfigs.current = configs} />

      </div>
    </div>
  );
}