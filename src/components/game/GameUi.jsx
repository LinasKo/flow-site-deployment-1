import { useState } from 'react';
import FancyLoader from './FancyLoader';

import './GameUi.scss';


export default function GameUi() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="uiRoot">

      {loading && <div className="loaderPane">
        <h1>Loading...</h1>
        <FancyLoader />
      </div>}

      {!loading && <>
        <div className="gameUi"></div>
      </>}
    </div>
  )
}
