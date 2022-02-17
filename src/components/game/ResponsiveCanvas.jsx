/**
 * Canvas can only display the video correctly if its size is set depending on orientation.
 * This component aims to address that.
 */

import { useState, useEffect } from 'react';
import { getScreenSize } from 'js/deviceTools';
import { debounce } from 'lodash';


function increaseToAspect([width, height], aspect) {
  let newHeight = height;

  let newWidth = Math.round(height * aspect);
  if (newWidth < width) {
    newWidth = width;
    newHeight = Math.round(width / aspect);
    console.assert(newHeight <= height, "increaseToAspect is wrong!", newHeight, ">", height);
  }
  return [newWidth, newHeight];
}

function getIdealCanvasSize(idealAspect) {
  let [sw, sh] = getScreenSize();
  if (sw > sh) {
    [sw, sh] = increaseToAspect([sw, sh], idealAspect);
  } else {
    [sw, sh] = increaseToAspect([sw, sh], 1 / idealAspect);
  }

  return [sw, sh];
}

export default function ResponsiveCanvas({ canvasRef, idealAspect }) {
  const [canvasSize, setCanvasSize] = useState(getIdealCanvasSize(idealAspect));

  useEffect(() => {
    const onResize = () => {
      const [sw, sh] = getIdealCanvasSize(idealAspect);
      setCanvasSize([sw, sh]);
    }
    const debouncedOnResize = debounce(onResize, 100);

    window.addEventListener('resize', debouncedOnResize);
    return () => {
      window.removeEventListener('resize', debouncedOnResize);
    }
  }, [idealAspect]);

  return (
    <canvas ref={canvasRef} width={canvasSize[0]} height={canvasSize[1]} />
  )
}
