import { useEffect, useRef, useState } from 'react'
import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";

import { makeFullEmbedding, makeLandmarkDict, linkInfo } from 'js/poseEmbedder';
import {
  drawSimpleImage,
  clearCanvas,
  drawBasicConnection,
  drawText
} from 'js/drawing';
import { LANDMARK_NAMES } from 'js/poseConstants';
import ResponsiveCanvas from './ResponsiveCanvas';
import FancyLoader from './FancyLoader';

import { PoseValidator } from 'js/poseValidator';
import { clamp } from 'js/utils';
import { isEmpty } from 'lodash';

import './ViewCalib.scss';

const IDEAL_VID_W = 1920;
const IDEAL_VID_H = 1080;
const IDEAL_ASPECT = IDEAL_VID_W / IDEAL_VID_H;

const VISIBILITY_THRESH = 0.25;
const MAX_VALIDATION_TIME_S = 20;
const WAIT_BEFORE_NEXT_S = 10.0;

/**
 * Lets fade in pose connections one at a time.
 * This is an array with lists [fading start (s), fading end (s), link]
*/
const FADE_BREAKPOINTS = [
  // 1
  [4, 6, ["right_elbow", "right_wrist"]],

  // 2
  [6, 8, ["left_shoulder", "left_elbow"]],

  // 2.5
  [7, 9, ["left_elbow", "left_wrist"]],

  // 3
  [8, 10, ["right_shoulder", "right_hip"]],
  [8, 10, ["left_knee", "left_ankle"]],

  // 3.5
  [9, 11, ["left_shoulder", "right_shoulder"]],
  [9, 11, ["right_shoulder", "right_elbow"]],
  [9, 11, ["right_hip", "right_ankle"]],

  // 4
  [10, 12, ["left_hip", "right_hip"]],
  [10, 12, ["right_hip", "right_knee"]],

  // 4.5
  [11, 13, ["left_hip", "left_knee"]],
  [11, 13, ["left_shoulder", "left_hip"]],
]
const MAX_FADE_TIME_S = Math.max(...FADE_BREAKPOINTS.map(bp => bp[1]));

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
  const videoStartedAtRef = useRef(null);
  const poseValidatorRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    function fadeInPose(poseDetResults) {
      if (!poseDetResults || !poseDetResults.poseWorldLandmarks) return;

      const canvas = canvasRef.current;

      // Partial embedding
      const landmarks = makeLandmarkDict(poseDetResults)

      console.assert(videoStartedAtRef.current !== null);
      const timeS = new Date().getTime() / 1000;

      // Draw
      for (const [startS, endS, [lm1name, lm2name]] of FADE_BREAKPOINTS) {
        const lm1 = landmarks[lm1name];
        const lm2 = landmarks[lm2name];

        const dur = timeS - videoStartedAtRef.current - startS;

        const alpha = clamp(dur / (endS - startS), 0.0, 1.0);
        drawBasicConnection(canvas, lm1, lm2, alpha, true);
      }
    }

    function validatePose(poseDetResults) {
      if (!poseDetResults || !poseDetResults.poseWorldLandmarks) return;

      console.assert(videoStartedAtRef.current !== null);
      console.assert(poseValidatorRef.current !== null);
      const timeS = new Date().getTime() / 1000;

      // Validate
      if (timeS > videoStartedAtRef.current + MAX_FADE_TIME_S) {
        console.log("Validating!");
        const landmarks = makeLandmarkDict(poseDetResults)

        const validErrors = poseValidatorRef.current.validatePose(landmarks);
        if (isEmpty(validErrors)) {
          setPoseLockedIn(true);
        } else {
          drawText(canvasRef.current, JSON.stringify(validErrors, null, 4));
        }
      }

      // Accept any validation
      if (timeS > videoStartedAtRef.current + MAX_FADE_TIME_S + MAX_VALIDATION_TIME_S) {
        setPoseLockedIn(true);
      }
    }

    function onPoseResult(results) {
      if (!canvasRef.current) return;  // Calib done

      clearCanvas(canvasRef.current);
      drawSimpleImage(canvasRef.current, results.image, true);

      if (videoStartedAtRef.current === null) {
        videoStartedAtRef.current = new Date().getTime() / 1000;
        poseValidatorRef.current = new PoseValidator();
      }

      // Draw pose
      fadeInPose(results);
      if (poseLockedIn) {
        drawText(canvasRef.current, "Pose locked in!");
      }

      // Validate
      if (!poseLockedIn) {
        validatePose(results);
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

    return () => {
      camera.stop();
      pose.close();
    }
  }, [poseLockedIn]);

  // Wait and transition to next view
  useEffect(() => {
    if (poseLockedIn) {
      setTimeout(() => {
        cbCalibComplete();
      }, WAIT_BEFORE_NEXT_S);
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
