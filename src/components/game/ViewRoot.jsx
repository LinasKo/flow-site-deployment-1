import { useState, useEffect, useRef } from 'react'

import ViewUi from './ViewUi';
import ViewPose from './ViewPose';

import './ViewRoot.scss';

// Refer to README.md for architecture details


export default function ViewRoot() {
  const [playing, setPlaying] = useState(false);
  const rootRef = useRef(null);
  const uiActions = {};
  const trackingActions = {};

  function handleRequestFullscreen() {
    const elem = rootRef.current;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    }
  }

  function handleStartTracking() {
    setPlaying(true);
  }

  function handlePoseDetected(poseDetResults) {
    uiActions.tellPoseDetected(poseDetResults);
  }

  function handleGameComplete() {
    trackingActions.cameraOff().then(() => {
      setTimeout(() => {
        setPlaying(false);
      }, 100);
    });

  }

  function handleDrawOnCanvas(func) {
    trackingActions.draw(func);
  }

  // Render
  return (
    <div className="viewRoot" ref={rootRef}>
      {playing && (
        <ViewPose
          onPoseDetected={handlePoseDetected}
          actions={trackingActions}
        />
      )}

      <ViewUi
        onRequestFullscreen={handleRequestFullscreen}
        onStartTracking={handleStartTracking}
        onGameComplete={handleGameComplete}
        drawOnCanvas={handleDrawOnCanvas}
        actions={uiActions}
      />
    </div>
  );
}


// TODO: Looks like s*** when zoomed out
// TODO: back to fullscreen button somewhere