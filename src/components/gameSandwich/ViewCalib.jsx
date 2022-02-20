import { useEffect, useRef, useState } from 'react'

import { PoseValidator } from 'js/poseValidator';
import { clamp } from 'js/utils';
import { isEmpty, has } from 'lodash';

import './ViewCalib.scss';

const MAX_VALIDATION_TIME_S = 20;
const WAIT_BEFORE_NEXT_S = 5.0;

const TOP_TEXT_VALIDATION = "Fixing stance";
const BOT_TEXT_VALIDATION = "Make sure your body is visible";
const BOT_TEXT_SUCCESS = "We're all set!";
const BOT_TEXT_TIMEOUT = "We're all set!";


export default function ViewCalib({ cbCalibComplete }) {

  return (
    <div className="calibRoot">
    </div>
  )
}


// TODO: draw even if no pose detections
