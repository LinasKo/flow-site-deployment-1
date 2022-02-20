import { useEffect, useRef, useState, useCallback } from 'react'

import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";

import { makeFullEmbedding, makeLandmarkDict, linkInfo } from 'js/poseEmbedder';
import {
  drawSimpleImage,
  clearCanvas,
  drawBasicConnection
} from 'js/drawing';
import { LANDMARK_NAMES } from 'js/poseConstants';
import { PoseValidator } from 'js/poseValidator';
import { clamp } from 'js/utils';
import { isEmpty, has } from 'lodash';

import ResponsiveCanvas from './ResponsiveCanvas';
import PropTypes from 'prop-types';


import './ViewPose.scss';


const IDEAL_VID_W = 1920;
const IDEAL_VID_H = 1080;
const IDEAL_ASPECT = IDEAL_VID_W / IDEAL_VID_H;


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


export default function ViewPose({ onPoseDetected, actions }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const poseRef = useRef(null);
  const cameraRef = useRef(null);
  const poseTrackingOnRef = useRef(true);

  // Receive messages externally
  useEffect(() => {
    actions.poseTrackingOn = poseTrackingOn;
    actions.poseTrackingOff = poseTrackingOff;
    actions.cameraOn = cameraOn;
    actions.cameraOff = cameraOff;
    actions.draw = draw;
  })

  // Internal
  const poseTrackingOn = useCallback(() => {
    return poseTrackingOnRef.current = true;
  }, [])
  const poseTrackingOff = useCallback(() => {
    return poseTrackingOnRef.current = true;
  }, [])
  const cameraOn = useCallback(() => {
    return cameraRef.current?.start();
  }, [])
  const cameraOff = useCallback(() => {
    return cameraRef.current?.stop();
  }, [])

  const handlePoseResults = useCallback((poseDetResults) => {
    onPoseDetected(poseDetResults);
  }, [onPoseDetected])

  const handleVideoFrame = useCallback(async () => {
    clearCanvas(canvasRef.current);
    drawSimpleImage(canvasRef.current, videoRef.current, true);
    // await poseRef.current.initialize();  // Ok, so awaiting it works, actually. Nice.

    if (poseTrackingOnRef.current) {
      await poseRef.current.send({ image: videoRef.current });
    }
  }, []);

  const draw = useCallback((func) => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    ctx.save();
    func(canvasRef.current);
    ctx.restore();
  }, []);

  useEffect(() => {

    // Init pose tracker
    poseRef.current = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      }
    });
    poseRef.current.setOptions(POSE_OPTS);
    poseRef.current.onResults(handlePoseResults);

    // Start Camera
    cameraRef.current = new Camera(videoRef.current, {
      onFrame: handleVideoFrame,
      width: IDEAL_VID_W,
      height: IDEAL_VID_H,
      facingMode: 'user',
    });
    cameraOn();

    return () => {
      cameraOff();
      poseRef.current.close();
    }
  }, [cameraOn, cameraOff, handleVideoFrame, handlePoseResults]);

  return (
    <div className="poseRoot">
      <video className="inputVideo" ref={videoRef}></video>
      <ResponsiveCanvas canvasRef={canvasRef} idealAspect={IDEAL_ASPECT} />
    </div>
  )
}
