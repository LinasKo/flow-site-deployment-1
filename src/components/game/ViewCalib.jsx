import { useEffect, useRef, useState } from 'react'
import './ViewCalib.scss';

import { clamp } from 'js/utils';
import { PoseValidator } from 'js/poseValidator';
import { makeLandmarkDict } from 'js/poseEmbedder';
import { drawBasicConnection } from 'js/drawing';

import { isEmpty, has } from 'lodash';


const MAX_VALIDATION_TIME_S = 20;
const WAIT_BEFORE_NEXT_S = 5.0;

const TOP_TEXT_VALIDATION = "Fixing stance";
const BOT_TEXT_VALIDATION = "Make sure your body is visible";
const BOT_TEXT_SUCCESS = "We're all set!";
const BOT_TEXT_TIMEOUT = "We're all set!";

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
const COUNT_FROM_NTH_POSE = 10;


export default function ViewCalib({ onValidComplete, drawOnCanvas, actions }) {
  const calibStartSRef = useRef(null);
  const validator = new PoseValidator(MAX_FADE_TIME_S);
  let poseNum = 0;

  useEffect(() => {
    actions.tellPoseDetected = handlePoseDetected;
  })

  function drawPoseFade(canvas, landmarks) {
    console.assert(calibStartSRef.current !== null);

    const timeS = new Date().getTime() / 1000;
    for (const [startS, endS, [lm1name, lm2name]] of FADE_BREAKPOINTS) {
      const lm1 = landmarks[lm1name];
      const lm2 = landmarks[lm2name];

      const dur = (timeS - calibStartSRef.current) - startS;

      const alpha = clamp(dur / (endS - startS), 0.0, 1.0);
      drawBasicConnection(canvas, lm1, lm2, alpha, true);
    }
  }

  function handlePoseDetected(poseDetResults) {
    if (!poseDetResults || !poseDetResults.poseWorldLandmarks) return;

    poseNum++;
    if (poseNum < COUNT_FROM_NTH_POSE) return;
    if (calibStartSRef.current === null) {
      calibStartSRef.current = new Date().getTime() / 1000
    }

    const landmarks = makeLandmarkDict(poseDetResults);

    drawOnCanvas((canvas) => drawPoseFade(canvas, landmarks));

    const poseErr = validator.validatePose(poseDetResults);
    if (isEmpty(poseErr)) {
      onValidComplete();
    }

    // TODO timeout
  }

  return (
    <div className="calibRoot">
    </div>
  )
}


// TODO: draw even if no pose detections
