import { useState, useEffect } from 'react'
import PropTypes from 'prop-types';

import imgPhotoRim from 'components/assets/photo_rim.png';

import "./CalibUi.scss";


export default function CalibUi(props) {
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [showFrame, setShowFrame] = useState(false);

  // Export events, allow updating this without rerendering parent
  useEffect(() => {
    props.extEvents.setTopText = setTopText;
    props.extEvents.setBottomText = setBottomText;
    props.extEvents.setShowFrame = setShowFrame;
  }, [props.extEvents]);

  // Render
  return (
    <div className="calibUi">
      <div className="topText">
        {topText}
      </div>

      {showFrame &&
        <img src={imgPhotoRim} alt="White angle-rim, marking the area on the screen, where the person needs to stand" />
      }

      <div className="bottomText">
        {bottomText}
      </div>
    </div>
  )
}


CalibUi.defaultProps = {
  extEvents: PropTypes.object.isRequired
};