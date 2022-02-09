// Landmarks (points)
export const LANDMARK_NAMES = [
  'nose',
  'left_eye_inner', 'left_eye', 'left_eye_outer',
  'right_eye_inner', 'right_eye', 'right_eye_outer',
  'left_ear', 'right_ear',
  'mouth_left', 'mouth_right',
  'left_shoulder', 'right_shoulder',
  'left_elbow', 'right_elbow',
  'left_wrist', 'right_wrist',
  'left_pinky_1', 'right_pinky_1',
  'left_index_1', 'right_index_1',
  'left_thumb_2', 'right_thumb_2',
  'left_hip', 'right_hip',
  'left_knee', 'right_knee',
  'left_ankle', 'right_ankle',
  'left_heel', 'right_heel',
  'left_foot_index', 'right_foot_index',
];

// The chosen limb link set to be used in computations
export const LINKS = [
  // HEAD
  // ["nose", "left_eye_inner"],
  // ["left_eye_inner", "left_eye"],
  // ["left_eye", "left_eye_outer"],
  // ["left_eye_outer", "left_ear"],
  // ["nose", "mouth_left"],

  // ["nose", "right_eye_inner"],
  // ["right_eye_inner", "right_eye"],
  // ["right_eye", "right_eye_outer"],
  // ["right_eye_outer", "right_ear"],
  // ["nose", "mouth_right"],

  // ["mouth_left", "mouth_right"],

  // Upper Body
  ["left_shoulder", "right_shoulder"],
  ["left_shoulder", "left_hip"],
  ["right_shoulder", "right_hip"],
  ["left_hip", "right_hip"],

  ["left_shoulder", "left_elbow"],
  ["left_elbow", "left_wrist"],

  ["right_shoulder", "right_elbow"],
  ["right_elbow", "right_wrist"],

  // Hands
  ["left_wrist", "left_pinky_1"],
  ["left_wrist", "left_index_1"],
  ["left_wrist", "left_thumb_2"],

  ["right_wrist", "right_pinky_1"],
  ["right_wrist", "right_index_1"],
  ["right_wrist", "right_thumb_2"],

  // Legs
  ["left_hip", "right_hip"],

  ["left_hip", "left_knee"],
  ["left_knee", "left_ankle"],
  ["left_ankle", "left_heel"],
  ["left_ankle", "left_foot_index"],
  ["left_heel", "left_foot_index"],

  ["right_hip", "right_knee"],
  ["right_knee", "right_ankle"],
  ["right_ankle", "right_heel"],
  ["right_ankle", "right_foot_index"],
  ["right_heel", "right_foot_index"]
];

// Validate
for (const [landmark1, landmark2] of LINKS) {
  console.assert(LANDMARK_NAMES.includes(landmark1));
  console.assert(LANDMARK_NAMES.includes(landmark2));
}

// Joints (3 points)
export const JOINTS = [
  // Elbows
  ["left_wrist", "left_elbow", "left_shoulder"],
  ["right_wrist", "right_elbow", "right_shoulder"],

  // Shoulders
  ["left_elbow", "left_shoulder", "left_hip"],
  ["right_elbow", "right_shoulder", "right_hip"],

  // Hips
  ["left_knee", "left_hip", "left_shoulder"],
  ["right_knee", "right_hip", "right_shoulder"],

  // Knees
  ["left_hip", "left_knee", "left_ankle"],
  ["right_hip", "right_knee", "right_ankle"],

  // Torso rotation computed in a special way, elsewhere
];

// Validate
for (const [landmark1, landmark2, landmark3] of JOINTS) {
  console.assert(LANDMARK_NAMES.includes(landmark1));
  console.assert(LANDMARK_NAMES.includes(landmark2));
  console.assert(LANDMARK_NAMES.includes(landmark3));
}

// No repeats within central joints
const central_joints = JOINTS.map(([, landmark2,]) => landmark2);
console.assert(new Set(central_joints).size === central_joints.length);

// Convenience functions

/** Long joint keys are auto-concatenated string "joint_1,joint_2,joint_3". */
export const JOINT_MAP_LONG_2_SHORT = new Map();
for (const jointNames of JOINTS) {
  const longName = jointNames.join(',');
  const shortName = jointNames[1];
  JOINT_MAP_LONG_2_SHORT.set(longName, shortName);
}
JOINT_MAP_LONG_2_SHORT.set('torso', 'torso');

/** Works as we check that central joints do not repeat */
export const JOINT_MAP_SHORT_2_LONG = new Map();
JOINT_MAP_LONG_2_SHORT.forEach(((short, long) => { JOINT_MAP_SHORT_2_LONG.set(short, long) }));

console.assert(JOINT_MAP_LONG_2_SHORT.size === JOINT_MAP_SHORT_2_LONG.size);