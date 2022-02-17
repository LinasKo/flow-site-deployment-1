import { useEffect, useRef, useState } from 'react'
import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";

import { makeFullEmbedding } from 'js/poseEmbedder';
import {
  drawSimpleImage,
  clearCanvas
} from 'js/drawing';
import { LANDMARK_NAMES } from 'js/poseConstants';
import ResponsiveCanvas from './ResponsiveCanvas';
import FancyLoader from './FancyLoader';

import './ViewCalib.scss';

const IDEAL_VID_W = 1920;
const IDEAL_VID_H = 1080;
const IDEAL_ASPECT = IDEAL_VID_W / IDEAL_VID_H;

const VISIBILITY_THRESH = 0.25;

/** Subset of LANDMARK_NAMES */
const REQUIRED_VISIBLE = [
  'left_shoulder', 'right_shoulder',
  'left_elbow', 'right_elbow',
  'left_wrist', 'right_wrist',
  'left_hip', 'right_hip',
  'left_knee', 'right_knee',
  'left_ankle', 'right_ankle',
];
console.assert(REQUIRED_VISIBLE.every((name) => LANDMARK_NAMES.includes(name)));

const POSE_OPTS = {
  modelComplexity: 1,  // [0, 1, 2]
  smoothLandmarks: true,
  enableSegmentation: false,
  smoothSegmentation: false,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
};


export default function ViewCalib({ cbCalibComplete }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [poseLockedIn, setPoseLockedIn] = useState(false);

  function isLandmarkVisible(poseEmbedding, lmName) {
    return poseEmbedding["landmarks"][lmName].visibility > VISIBILITY_THRESH;
  }

  function isPoseVisible(poseEmbedding) {
    for (const lmName of REQUIRED_VISIBLE) {
      if (isLandmarkVisible(poseEmbedding, lmName)) {
        return false;
      }
    }
    return true;
  }

  // TODO: pose stability?

  useEffect(() => {
    const video = videoRef.current;
    // function drawPose(poseDetResults, embedding, scores, segmentation = false) {
    //   const canvas = canvasRef.current;
    //   const ctx = canvasRef.current.getContext('2d');
    //   ctx.clearRect(0, 0, canvas.width, canvas.height);

    //   if (segmentation) {
    //     drawWithSegmentation(canvas, poseDetResults);
    //   } else {
    //     drawSimpleImage(canvas, poseDetResults.image, FLIP_VIDEO)
    //   }
    //   // drawMpConnections(canvas, poseDetResults);
    //   drawConnections(canvas, embedding, drawingConfigs.current, FLIP_VIDEO);
    //   drawScores(canvas, embedding, scores, drawingConfigs.current, FLIP_VIDEO);
    //   drawPoints(canvas, embedding, drawingConfigs.current, FLIP_VIDEO);
    // }

    function onPoseResult(results) {
      clearCanvas(canvasRef.current);
      drawSimpleImage(canvasRef.current, results.image, true);

      if (!poseLockedIn) {
        const embedding = makeFullEmbedding(results);

        if (!embedding) return;
        if (isPoseVisible(embedding)) {
          setPoseLockedIn(true);
          cbCalibComplete(embedding);
        }
      }
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
    const camera = new Camera(video, {
      onFrame: async () => {
        await pose.send({ image: video });
      },
      width: IDEAL_VID_W,
      height: IDEAL_VID_H,
      facingMode: 'user',
    });
    camera.start();

    // setTimeout(() => {
    //   camera.stop();
    // }, 5000)

    return () => {
      camera.stop();
      pose.close();
    }
  }, [cbCalibComplete, poseLockedIn]);

  return (
    <div className="calibRoot">
      <div className="loaderPane">
        <h1>Loading...</h1>

        <FancyLoader />
      </div>

      <video className="inputVideo" ref={videoRef}></video>
      <ResponsiveCanvas canvasRef={canvasRef} idealAspect={IDEAL_ASPECT} />
      {/* <canvas className="outputCanvas" ref={canvasRef} width={screenSize[1]} height={screenSize[0]}></canvas> */}
      {/*
      <div className="personUi">
        <div className="infoText">
          Fixing stance...
        </div>
        <img src={imgPhotoRim} alt="White angle-rim, marking the area on the screen, where the person needs to stand" />
        <div className="stateText">
          You're all set
        </div>
      </div> */}
    </div>
  )
}


// TODO: draw even if no pose detections
