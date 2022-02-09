import React from "react";
import lottie from "lottie-web";

import reward from '../assets/reward_mobile.png';
import celebrate from '../assets/animation/celebrate.json'

const Reward = () => {
  // for wave json file
  React.useEffect(() => {
    lottie.loadAnimation({
      container: document.querySelector('#celebrate'),
      animationData: celebrate,
    });
  }, []);
  return (
    <div className='section fp-auto-height-responsive' id='reward-section'>
      <div className='container'>
        <div className='row'>
          <div className='reward-section__text'>
            <h1>Earn real rewards as you go</h1>
            <p>Collect FlowCoins that are redeemable to purchase products with our
              <br />partner yoga and fitness brands.
            </p>
          </div>
          <div className='reward-section__img'>
            <div id="celebrate"></div>
            <img src={reward} alt='Reward Mobile' className='img-fluid' />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reward;