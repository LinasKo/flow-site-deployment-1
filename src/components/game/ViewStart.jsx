import { useState, useEffect, useRef } from 'react'
import './ViewStart.scss';
import Particles from "react-tsparticles";


export default function ViewStart({ onStart }) {
  function handleStart() {
    onStart();
  }

  return (
    <div className="startRoot">
      <button className="startButton" onClick={handleStart}>
        Start
      </button>

      <div className="particleContainer">
        <Particles
          id="tsparticles"
          options={{
            fpsLimit: 80,
            particles: {
              color: {
                value: "#000000",
              },
              links: {
                color: "#000000",
                distance: 300,
                enable: true,
                opacity: 0.5,
                width: 2,
              },
              collisions: {
                enable: true,
              },
              move: {
                direction: "none",
                enable: true,
                outMode: "bounce",
                random: true,
                speed: 1,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 20,
              },
              opacity: {
                value: 0.8,
              },
              shape: {
                type: "circle",
              },
              size: {
                random: true,
                value: 6,
              },
            },
            detectRetina: true,
          }}
        />
      </div>

    </div>
  )
}
