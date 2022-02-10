import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import ViewRoot from './components/game/ViewRoot';
import ReactFullpage from '@fullpage/react-fullpage';

import Banner from './components/website/Banner'
import Question from './components/website/Question'
import Program from "./components/website/Program";
import Video from "./components/website/Video";
import VideoTwo from './components/website/VideoTwo';
import VideoThree from './components/website/VideoThree';
import VideoFour from './components/website/VideoFour';
import Reward from "./components/website/Reward";
import Quote from "./components/website/Quote";
import Contact from "./components/website/Contact";

// NOTE: if using fullpage extensions/plugins put them here and pass it as props
/*const pluginWrapper = () => {
  require('./statics/fullpage.fadingEffect.min');
};
*/

class App extends React.Component {

  render() {
    const FULL_PAGE_LICENSE_KEY = process.env.REACT_APP_FULL_PAGE_LICENSE_KEY;

    return (
      <Router>
        <Routes>
          <Route path="/play" element={<ViewRoot />} />
          <Route path="/" element={
            <ReactFullpage

              licenseKey={FULL_PAGE_LICENSE_KEY}
              fadingEffect
              responsiveWidth={800}
              afterLoad={(origin, destination, direction) => {
                console.log("afterLoad event", { origin, destination, direction });
                if (destination.index === 0 || destination.index === 1) {
                  window.fullpage_api.fadingEffect.turnOff();
                } if (destination.index === 2 || destination.index === 3 ||
                  destination.index === 4 || destination.index === 5
                  || destination.index === 6) {
                  window.fullpage_api.fadingEffect.turnOn();
                } else {
                  window.fullpage_api.fadingEffect.turnOff();
                }
              }}

              afterResponsive={(isResponsive) => {
                window.fullpage_api.fadingEffect.turnOff();
              }}

              render={({ state, fullpage_api }) => {

                return (

                  <div id="fullpage-wrapper">

                    <Banner />
                    <Question />
                    <Program />
                    <Video />
                    <VideoTwo />
                    <VideoThree />
                    <VideoFour />
                    <Reward />
                    <Quote />
                    <Contact />
                  </div>
                );
              }}
            />
          } />
        </Routes>
      </Router>
    );
  }
}

export default App;
