import React from 'react';
import ReactFullpage from '@fullpage/react-fullpage';

import Banner from './components/Banner'
import Question from './components/Question'
import Program from "./components/Program";
import Video from "./components/Video";
import VideoTwo from './components/VideoTwo';
import VideoThree from './components/VideoThree';
import VideoFour from './components/VideoFour';
import Reward from "./components/Reward";
import Quote from "./components/Quote";
import Contact from "./components/Contact";

// NOTE: if using fullpage extensions/plugins put them here and pass it as props
/*const pluginWrapper = () => {
  require('./statics/fullpage.fadingEffect.min');
};
*/

class App extends React.Component {

  render() {
    return (
      <ReactFullpage

        licenseKey={"1D2C3363-9E204A14-B69CBB27-FE85CA55"}
        fadingEffect
        responsiveWidth={800}
        afterLoad={(origin, destination, direction) => {
          console.log("afterLoad event", { origin, destination, direction });
          if(destination.index === 0 || destination.index === 1){
            window.fullpage_api.fadingEffect.turnOff();
          }if(destination.index === 2 || destination.index === 3 || 
            destination.index === 4 || destination.index === 5 
            ||destination.index === 6){
            window.fullpage_api.fadingEffect.turnOn();
          }else{
            window.fullpage_api.fadingEffect.turnOff();
          }
        }}

        afterResponsive={(isResponsive) =>{
          
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
    );
  }
}

export default App;
