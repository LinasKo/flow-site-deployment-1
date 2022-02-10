import { useEffect } from 'react'

import './ViewCalib.scss';


export default function ViewCalib({ cbCalibComplete }) {

  useEffect(() => {
    setTimeout(() => {
      cbCalibComplete();
    }, 500)
  }, [cbCalibComplete])

  return (
    <div className="calibRoot">
      {/* <video /> TODO: webcam vid */}
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
