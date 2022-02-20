import { useState, useEffect, useRef } from 'react'
import './ViewStart.scss';

export default function ViewStart({ onStart }) {
  function handleStart() {
    onStart();
  }

  return (
    <div className="startRoot">
      <button className="startButton" onClick={handleStart}>
        Start
      </button>
    </div>
  )
}
