/** For pose validation / calibration - measuring if it's in the shot */
import { LINKS } from './poseConstants';


const LANDMARKS = new Set();
for (const [landmark1, landmark2] of LINKS) {
  LANDMARKS.add(landmark1);
  LANDMARKS.add(landmark2);
}

export class ValidError {
  constructor(lmName, type) {
    this.lmName = lmName;
    this.type = type;
  }
}

const VALIDATION_PERIOD_S = 1.5;
const VISIBILITY_THRESH = 0.33;
const STD_THRESH = 100;


export class PoseValidator {
  constructor() {
    this.startS = new Date().getTime() / 1000;
    this.prevPoses = [];
  }

  #clearPoses() {
    const timeS = new Date().getTime() / 1000;
    this.prevPoses = this.prevPoses.filter(({ timeAddedS }) => {
      return timeAddedS + VALIDATION_PERIOD_S > timeS;
    });
  }

  #addPose(landmarks) {
    const timeS = new Date().getTime() / 1000;
    this.#clearPoses();
    this.prevPoses.push({
      timeAddedS: timeS,
      landmarks,
    });
  }

  validatePose(landmarks) {
    this.#addPose(landmarks);
    const errors = [];

    // Presence
    for (const lmName of LANDMARKS) {
      for (const pose of this.prevPoses) {
        if (!pose.landmarks[lmName]) {
          errors.push(new ValidError(lmName, "missing"));
          break;
        }
      }
    }
    if (errors.length !== 0) return errors;

    // Visibility
    for (const lmName of LANDMARKS) {
      for (const pose of this.prevPoses) {
        if (pose.landmarks[lmName].visibility < VISIBILITY_THRESH) {
          errors.push(new ValidError(lmName, "invisible"));
          break;
        }
      }
    }
    if (errors.length !== 0) return errors;

    // Stability
    for (const lmName of LANDMARKS) {
      let meanX = 0;
      let meanY = 0;

      for (const pose of this.prevPoses) {
        meanX += pose.landmarks[lmName].x;
        meanY += pose.landmarks[lmName].y;
      }

      meanX /= this.prevPoses.length;
      meanY /= this.prevPoses.length;

      let meanDiffSqX = 0;
      let meanDiffSqY = 0;
      for (const pose of this.prevPoses) {
        const diffX = pose.landmarks[lmName].x - meanX;
        const diffY = pose.landmarks[lmName].y - meanY;
        meanDiffSqX += diffX * diffX;
        meanDiffSqY += diffY * diffY;
      }
      const stdX = Math.sqrt(meanDiffSqX / this.prevPoses.length);
      const stdY = Math.sqrt(meanDiffSqY / this.prevPoses.length);

      if (stdX > STD_THRESH || stdY > STD_THRESH) {
        errors.push(new ValidError(lmName, "unstable"));
      }
    }
    if (errors.length !== 0) return errors;

    // Done
    return errors;
  }
}