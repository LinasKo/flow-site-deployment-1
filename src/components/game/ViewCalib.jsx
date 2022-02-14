import { useEffect, useRef, useState } from 'react'
import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";

import { makeFullEmbedding } from '../../js/poseEmbedder';
import { jointScores } from '../../js/poseFeedback';
import {
  drawWithSegmentation,
  drawSimpleImage,
  drawConnections,
  drawPoints,
  drawScores
} from '../../js/poseVisuals';

import './ViewCalib.scss';


export default function ViewCalib({ cbCalibComplete }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
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

    function drawSimplePose(results) {
      const canvas = canvasRef.current;
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawSimpleImage(canvas, results.image, true)
    }

    function onPoseResult(results) {

      // const embedding = makeFullEmbedding(results);
      // let scores;
      // if (embedding) {
      //   scores = jointScores("downdog", embedding);
      // }
      // drawPose(results, embedding, scores, ENABLE_SEGMENTATION);
      drawSimplePose(results);
    }

    const pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      }
    });
    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
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
    camera.start();

    return () => {
      camera.stop();
    }
  }, []);

  return (
    <div className="calibRoot">
      <video className="inputVideo" ref={videoRef}></video>
      <canvas className="outputCanvas" ref={canvasRef} width="1280px" height="720px"></canvas>

      <div className="infoText">
        Fixing stance...
      </div>
      <div className="personUi">
        <div className="stateText">
          You're all set
        </div>
      </div>
    </div>
  )
}
