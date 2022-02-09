import poseMetadata from './poseMetadata.json';
import { JOINT_MAP_LONG_2_SHORT } from './poseConstants'
import { clamp } from './utils';

const IDEAL_SCORE_WINDOW = 5;  // degrees
const WORST_SCORE = 180 - IDEAL_SCORE_WINDOW;  // Can let us mark pose as red earlier


export function jointScores(poseName, embedding) {
  const scores = {};
  for (const jointName in embedding["joints"]) {
    const score = jointScore(poseName, jointName, embedding);
    scores[jointName] = score;
  }
  return scores;
}

/**
 * Calculate score.
 * Ranges from 0 to 1, with 1 being the worst.
 */
function jointScore(poseName, jointNameLong, embedding) {
  const jointNameShort = JOINT_MAP_LONG_2_SHORT.get(jointNameLong);
  const targetAngle = poseMetadata[poseName]["angles"][jointNameShort];
  const currentAngle = embedding["joints"][jointNameLong]["angle"] * 180 / Math.PI;

  let diff = Math.min(
    Math.abs(targetAngle - currentAngle),
    360 - Math.abs(targetAngle - currentAngle)
  );
  diff = Math.max(0, diff - IDEAL_SCORE_WINDOW);
  const score = clamp(diff / WORST_SCORE, 0, 1);

  return score
}
