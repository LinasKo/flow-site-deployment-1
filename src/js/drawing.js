import { drawLandmarks, drawConnectors } from "@mediapipe/drawing_utils";
import { POSE_CONNECTIONS } from "@mediapipe/pose";
import { clamp } from "lodash";


/* Notes:
  default ctx.globalCompositeOperation === "source-over"
*/

const VISIBILITY_THRESHOLD = 0.5;
const EXCLUDE_KEYPOINTS = ["eye", "nose", "mouth", "ear", "pinky", "index", "thumb"];

const COLOR_BASE = '#FFFFFFA0';
const THICKNESS_CONNECTOR = 4;
const THICKNESS_CIRCLE_OUTER = 10;

const COLOR_NEUTRAL = "#BBBBBB";
const COLOR_LEFT = "#6464FF";
const COLOR_RIGHT = "#FF6400";
const THICKNESS_CIRCLE_INNER = 7;

const COLOR_SEGMENTATION = "#00008888";
const COLOR_GOOD = "#00FF00";
const COLOR_BAD = "#FF0000";
const COLOR_GRADED_BASE = "#BBBBBB00";
const THICKNESS_GRADED = 6;


export function drawWithSegmentation(canvas, poseDetResults) {
  const ctx = canvas.getContext("2d");
  ctx.save();

  if (poseDetResults.segmentationMask) {
    ctx.drawImage(poseDetResults.segmentationMask, 0, 0, canvas.width, canvas.height);

    // Only overwrite existing pixels.
    ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = COLOR_SEGMENTATION;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Only overwrite missing pixels.
  ctx.globalCompositeOperation = 'destination-atop';
  ctx.drawImage(poseDetResults.image, 0, 0, canvas.width, canvas.height);

  ctx.restore();
}

export function drawSimpleImage(canvas, image, flipped = false) {
  const ctx = canvas.getContext("2d");
  ctx.save();

  ctx.globalCompositeOperation = 'source-over';
  if (flipped) {
    ctx.scale(-1, 1);
    ctx.drawImage(image, 0, 0, canvas.width * -1, canvas.height);
  } else {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  }

  ctx.restore();
}

export function drawMpConnections(canvas, poseDetResults) {
  const ctx = canvas.getContext("2d");
  ctx.save();

  ctx.globalCompositeOperation = 'source-over';
  drawConnectors(ctx, poseDetResults.poseLandmarks, POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
  drawLandmarks(ctx, poseDetResults.poseLandmarks, { color: '#FF0000', lineWidth: 2 });

  ctx.restore();
}

export function drawConnections(canvas, embedding, configs = null, flip = false) {
  if (!embedding) return;

  const ctx = canvas.getContext("2d");
  ctx.save();

  ctx.globalCompositeOperation = 'source-over';
  const color = configs?.colorBase || COLOR_BASE;
  const lineWidth = configs?.thicknessLink || THICKNESS_CONNECTOR;

  const links = embedding["links"];

  // TODO: visibility

  // Draw simple straight lines between links
  for (const linkName in links) {
    const [lm1name, lm2name] = linkName.split(",");

    let excluded = false;
    for (const excludedKeyword of EXCLUDE_KEYPOINTS) {
      if (lm1name.includes(excludedKeyword) || lm2name.includes(excludedKeyword)) {
        excluded = true;
        break;
      }
    }
    if (excluded) continue;

    const linkVis = links[linkName]["visibility"];
    if (linkVis >= VISIBILITY_THRESHOLD) {

      let { xCanvas: x1, yCanvas: y1 } = landmark2DInfo(embedding, canvas, lm1name);
      let { xCanvas: x2, yCanvas: y2 } = landmark2DInfo(embedding, canvas, lm2name);

      if (flip) {
        const width = canvas.width;
        x1 = width - x1;
        x2 = width - x2;
      }

      drawLine(ctx, x1, y1, x2, y2, color, lineWidth);
    }
  }

  ctx.restore();
}

export function drawPoints(canvas, embedding, configs = null, flip = false) {
  if (!embedding) return;

  const ctx = canvas.getContext("2d");
  ctx.save();

  ctx.globalCompositeOperation = 'source-over';

  const landmarks = embedding["landmarks"];

  // Draw simple straight lines between links
  for (const lmName in landmarks) {
    if (EXCLUDE_KEYPOINTS.some(word => lmName.includes(word))) continue;


    let { xCanvas: x, yCanvas: y, visibility: vis } = landmark2DInfo(embedding, canvas, lmName);
    if (flip) {
      const width = canvas.width;
      x = width - x;
    }

    if (vis >= VISIBILITY_THRESHOLD) {

      drawCircle(ctx, x, y, configs?.thicknessCircleOuter || THICKNESS_CIRCLE_OUTER, configs?.colorBase || COLOR_BASE);

      let color = configs?.colorMiddle || COLOR_NEUTRAL;
      if (lmName.includes("left")) {
        color = configs?.colorLeft || COLOR_LEFT;
      }
      else if (lmName.includes("right")) {
        color = configs?.colorRight || COLOR_RIGHT;
      }

      drawCircle(ctx, x, y, configs?.thicknessCircleInner || THICKNESS_CIRCLE_INNER, color);
    }
  }

  ctx.restore();
}


export function drawScores(canvas, embedding, scores, configs = null, flip = false) {
  if (!embedding) return;

  const ctx = canvas.getContext("2d");
  ctx.save();

  const links = embedding["links"];
  const landmarks = embedding["landmarks"];
  const joints = embedding["joints"];

  // Find the colors
  const coloredLandmarks = {};
  for (const jointName in joints) {
    if (jointName === "torso") {
      // Do nothing for now. TODO.
      continue
    }
    const [, lm2name,] = jointName.split(",");
    const { xCanvas: x2, yCanvas: y2 } = landmark2DInfo(embedding, canvas, lm2name);

    const score = scores[jointName];
    const rgb = rateToRGB(score, configs);
    const color = RGBToHex(...rgb);

    coloredLandmarks[lm2name] = { x: x2, y: y2, color };
  }

  // Draw lines
  for (const linkName in links) {
    const [lm1name, lm2name] = linkName.split(",");
    const vis = links[linkName].visibility;
    if (vis <= VISIBILITY_THRESHOLD) continue;

    let x1, y1, x2, y2, color1, color2;
    if (lm1name in coloredLandmarks) {
      x1 = coloredLandmarks[lm1name].x;
      y1 = coloredLandmarks[lm1name].y;
      color1 = coloredLandmarks[lm1name].color;
    } else {
      x1 = landmarks[lm1name].xImg * canvas.width;
      y1 = landmarks[lm1name].yImg * canvas.height;
      color1 = configs?.colorGradedBase || COLOR_GRADED_BASE;
    }

    if (lm2name in coloredLandmarks) {
      x2 = coloredLandmarks[lm2name].x;
      y2 = coloredLandmarks[lm2name].y;
      color2 = coloredLandmarks[lm2name].color;
    } else {
      x2 = landmarks[lm2name].xImg * canvas.width;
      y2 = landmarks[lm2name].yImg * canvas.height;
      color2 = configs?.colorGradedBase || COLOR_GRADED_BASE;
    }

    if (flip) {
      const width = canvas.width;
      x1 = width - x1;
      x2 = width - x2;
    }

    drawLineGradient(ctx, x1, y1, x2, y2, color1, color2, configs?.thicknessGraded || THICKNESS_GRADED);
  }

  ctx.restore();
}

export function drawText(canvas, text) {
  const ctx = canvas.getContext("2d");
  ctx.save();

  ctx.globalCompositeOperation = 'source-over';
  ctx.font = "20px Arial";
  ctx.fillStyle = "red";
  ctx.fillText(text, 20, 20);

  ctx.restore();
}

export function clearCanvas(canvas) {
  const ctx = canvas.getContext("2d");
  ctx.save();

  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.restore();
}

/** Convert a number between 0 (GOOD) and 1 (BAD) to RGB color value */
function rateToRGB(errorRate, configs = null) {
  // To HSV
  const colorRgbOk = hexToRGB(configs?.colorGood || COLOR_GOOD);
  const colorRgbBad = hexToRGB(configs?.colorBad || COLOR_BAD);

  const colorHsvOk = RGBtoHSV(...colorRgbOk);
  const colorHsvErr = RGBtoHSV(...colorRgbBad);

  // Hue
  const hueOk = colorHsvOk[0];
  const hueErr = colorHsvErr[0];
  let hue;
  const hueDiff = Math.abs(hueOk - hueErr);
  if (hueOk >= hueErr) {
    hue = hueErr + hueDiff * (1 - errorRate)
  } else {
    hue = hueOk + hueDiff * errorRate;
  }
  hue = clamp(hue, 0, 1);

  // Saturation
  const satOk = colorHsvOk[1];
  const satErr = colorHsvErr[1];
  let sat = satOk * (1 - errorRate) + satErr * errorRate;
  sat = clamp(sat, 0, 1);

  // Value
  const valOk = colorHsvOk[2];
  const valErr = colorHsvErr[2];
  let val = valOk * (1 - errorRate) + valErr * errorRate;
  val = clamp(val, 0, 1);

  let rgbColor = HSVtoRGB(hue, sat, val);
  return rgbColor;
}

/**
 * All arguments expected to be between 0 and 1.
 * src: https://stackoverflow.com/a/17243070/3369193
 */
function HSVtoRGB(h, s, v) {
  console.assert(0 <= h && h <= 1 && 0 <= s && s <= 1 && 0 <= v && v <= 1,
    `HSVtoRGB: hsv values must be between 0 and 1. Got: ${h}, ${s}, ${v}`
  );

  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
    s = h.s;
    v = h.v;
    h = h.h;
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
    default:
      throw new Error("Too many digits for HSVtoRGB conversion");
  }
  return [
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255)
  ];
}

/**
 * All arguments expected to be between 0 and 255.
 * src: https://stackoverflow.com/a/8023734/3369193
 */
function RGBtoHSV(r, g, b) {
  let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc;
  rabs = r / 255;
  gabs = g / 255;
  babs = b / 255;
  v = Math.max(rabs, gabs, babs);
  diff = v - Math.min(rabs, gabs, babs);
  diffc = c => (v - c) / 6 / diff + 1 / 2;
  if (diff === 0) {
    h = s = 0;
  } else {
    s = diff / v;
    rr = diffc(rabs);
    gg = diffc(gabs);
    bb = diffc(babs);

    if (rabs === v) {
      h = bb - gg;
    } else if (gabs === v) {
      h = (1 / 3) + rr - bb;
    } else if (babs === v) {
      h = (2 / 3) + gg - rr;
    }
    if (h < 0) {
      h += 1;
    } else if (h > 1) {
      h -= 1;
    }
  }
  return [h, s, v];
}

function RGBToHex(red, green, blue) {
  const rgb = (red << 16) | (green << 8) | (blue << 0);
  return '#' + (0x1000000 + rgb).toString(16).slice(1);
}

function hexToRGB(hex) {
  const normal = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (normal) return normal.slice(1).map(e => parseInt(e, 16));

  const shorthand = hex.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
  if (shorthand) return shorthand.slice(1).map(e => 0x11 * parseInt(e, 16));

  throw new Error("Invalid hex color: " + hex);
}

function drawLine(ctx, x1, y1, x2, y2, color, lineWidth) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
}

function drawLineGradient(ctx, x1, y1, x2, y2, color1, color2, lineWidth) {
  const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  drawLine(ctx, x1, y1, x2, y2, gradient, lineWidth);
}

function drawCircle(ctx, x, y, radius, color, lineWidth = 1) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.lineWidth = lineWidth;
  ctx.fillStyle = color;
  ctx.fill();
}

function landmark2DInfo(embedding, canvas, lmName) {
  const landmarks = embedding["landmarks"];
  const { xImg: x, yImg: y, visibility } = landmarks[lmName];

  const xCanvas = x * canvas.width;
  const yCanvas = y * canvas.height;

  return { x, y, xCanvas, yCanvas, visibility };
}