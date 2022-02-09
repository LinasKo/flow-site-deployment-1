import { cloneDeep } from 'lodash';

import { LANDMARK_NAMES, LINKS, JOINTS } from "./poseConstants";


const VISIBILITY_TOLERANCE = 0.5;


// lm == landmark

/**
 * Make the whole embedding object
 *
 * Can be null
*/
export function makeFullEmbedding(poseDetResults) {
  // If detection fails, result can return an object with just "image" key.
  if (!("poseWorldLandmarks" in poseDetResults)) {
    console.warn("Failed to detect pose");
    return null;
  }

  const lmDict = makeLandmarkDict(poseDetResults);

  const links = linkInfo(lmDict);

  const joints = jointInfo(lmDict);
  const [torsoAngle, torsoVisibility] = torsoRotation(lmDict);
  joints["torso"] = { angle: torsoAngle, visibility: torsoVisibility };

  try {
    normalizeLinkLengths(lmDict, links);
  }
  catch (e) {
    console.warn("Warning: links not normalized. Reason:  " + e.message);
  }

  return { "landmarks": lmDict, "links": links, "joints": joints };
}

export function makeLandmarkDict(poseDetResults) {
  let landmarks = cloneDeep(poseDetResults.poseWorldLandmarks);
  const landmarks2D = poseDetResults.poseLandmarks

  console.assert(landmarks.length === LANDMARK_NAMES.length);
  for (const [i, name] of LANDMARK_NAMES.entries()) {
    landmarks[name] = landmarks[i];
    landmarks[name]["xImg"] = landmarks2D[i]["x"];
    landmarks[name]["yImg"] = landmarks2D[i]["y"];
    landmarks[name]["zImg"] = landmarks2D[i]["z"];
    delete landmarks[i];
  }

  return landmarks;
}

function linkInfo(lmDict) {
  const distance = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);

  const links = {};
  for (const [lm1Name, lm2Name] of LINKS) {
    const lm1 = lmDict[lm1Name];
    const lm2 = lmDict[lm2Name];

    const length = distance(lm1["x"], lm1["y"], lm2["x"], lm2["y"]);
    const visibility = Math.min(lm1["visibility"], lm2["visibility"]);

    links[[lm1Name, lm2Name]] = { length, visibility };
  }

  return links;
}

function jointInfo(lmDict) {
  const joints = {};

  for (const [lm1Name, lm2Name, lm3Name] of JOINTS) {
    const lm1 = lmDict[lm1Name];
    const lm2 = lmDict[lm2Name];
    const lm3 = lmDict[lm3Name];

    const x1 = lm1["x"];
    const y1 = lm1["y"];
    const x2 = lm2["x"];
    const y2 = lm2["y"];
    const x3 = lm3["x"];
    const y3 = lm3["y"];

    const angle = Math.atan2(y1 - y2, x1 - x2) - Math.atan2(y3 - y2, x3 - x2);
    const visibility = Math.min(lm1["visibility"], lm2["visibility"], lm3["visibility"]);

    joints[[lm1Name, lm2Name, lm3Name]] = { angle, visibility };
  }

  return joints;
}

function torsoRotation(lmDict) {
  const leftShoulder = lmDict["left_shoulder"];
  const rightShoulder = lmDict["right_shoulder"];
  const leftHip = lmDict["left_hip"];
  const rightHip = lmDict["right_hip"];

  const visibility = Math.min(leftShoulder["visibility"], rightShoulder["visibility"], leftHip["visibility"], rightHip["visibility"]);
  const shoulderVector = [leftShoulder["x"] - rightShoulder["x"], leftShoulder["y"] - rightShoulder["y"]];
  const hipVector = [leftHip["x"] - rightHip["x"], leftHip["y"] - rightHip["y"]];
  const torsoRotation = Math.atan2(shoulderVector[1], shoulderVector[0]) - Math.atan2(hipVector[1], hipVector[0]);

  return [torsoRotation, visibility];
}

function normalizeLinkLengths(lmDict, links) {
  const torsoH = torsoHeight(lmDict, links);
  for (const [, link] of Object.entries(links)) {
    link["length"] /= torsoH;
  }
}

function torsoHeight(lmDict, links) {
  const linkLeft = ["left_shoulder", "left_hip"];
  const linkRight = ["right_shoulder", "right_hip"];

  const leftVis0 = lmDict[linkLeft[0]]["visibility"];
  const leftVis1 = lmDict[linkLeft[1]]["visibility"];
  const rightVis0 = lmDict[linkRight[0]]["visibility"];
  const rightVis1 = lmDict[linkRight[1]]["visibility"];

  console.assert(0.0 <= leftVis0 && leftVis0 <= 1.0, `leftVis0: ${leftVis0}`);
  console.assert(0.0 <= leftVis1 && leftVis1 <= 1.0, `leftVis1: ${leftVis1}`);
  console.assert(0.0 <= rightVis0 && rightVis0 <= 1.0, `rightVis0: ${rightVis0}`);
  console.assert(0.0 <= rightVis1 && rightVis1 <= 1.0, `rightVis1: ${rightVis1}`);

  const isLeftVis = leftVis0 > VISIBILITY_TOLERANCE && leftVis1 > VISIBILITY_TOLERANCE;
  const isRightVis = rightVis0 > VISIBILITY_TOLERANCE && rightVis1 > VISIBILITY_TOLERANCE;
  if (!(isLeftVis || isRightVis)) {
    throw new Error("At least one side of the torso must be visible");
  }

  const weightLeft = (leftVis0 + leftVis1) / (leftVis0 + leftVis1 + rightVis0 + rightVis1);
  const weightedLength = weightLeft * links[linkLeft]["length"] + (1 - weightLeft) * links[linkRight]["length"];

  return weightedLength;
}
