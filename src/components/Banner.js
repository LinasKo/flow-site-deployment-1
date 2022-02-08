import React from 'react';
import lottie from "lottie-web";

import hero from './assets/hero_section_pic.png'
import stars from './assets/stars.png';
import soundAnimation from './assets/animation/sound-wave.json'
import Header from './Header';


import MailchimpForm from './MailchimpForm';

const Banner = () => {

  // for wave json file
  React.useEffect(() => {
    lottie.loadAnimation({
      container: document.querySelector('#sound-wave'),
      animationData: soundAnimation,
    });
  }, []);

  return (
    <div id='banner' cl='section fp-auto-height-responsive'>
      <Header />
      <div cl="banner-respoansive container">
        <div cl="row">

          <div cl='col-xxl-6 col-md-6 banner-section_left'>
            <h2>The first interactive platform to guide,
              align and reassure that you’re nailing your practice.
            </h2>
            <h4>Launching soon! Subscribe to get a 30-day trial</h4>
            <div cl='newsletter'>

              <MailchimpForm />

            </div>
            <div cl='rating'>
              <img src={stars} alt='rating' />
              <p>4.8 stars [Rated on quality and precision by yoga instructors]</p>
            </div>
            <div cl='social-media'>
              <a cl='hvr-radial-out' href='https://facebook.com/'>
                <i cl="fa fa-facebook" aria-hidden="true"></i>
              </a>
              <a cl='hvr-radial-out' href='https://twitter.com/'>
                <i cl="fa fa-twitter" aria-hidden="true"></i>
              </a>
              <a cl='hvr-radial-out' href='https://instgram.com/'>
                <i cl="fa fa-instagram"></i>
              </a>
              <a cl='hvr-radial-out' href='https://linkedin.com/'>
                <i cl="fa fa-linkedin" aria-hidden="true"></i>
              </a>
            </div>

          </div>

          <div cl='col-xxl-6 col-md-6 banner-section_right'>
            <div cl='banner-image'>
              <img src={hero} alt='Hero section pic' cl='img-fluid' />
            </div>
            <div cl='voice'>
              <div id='sound-wave'></div>
              <p>Good job Emily! Now push your hands down into the floor to create
                more space between your shoulders and ears.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default Banner;